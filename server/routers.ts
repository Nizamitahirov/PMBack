import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getActivePerformanceYear,
  getEmployeeByUserId,
  getObjectivesByEmployee,
  getEmployeePerformance,
  getCompetencyAssessments,
  getAllBehavioralCompetencies,
  getEvaluationScales,
  getPerformanceWeightConfig,
  getBonusCalculation,
  getTeamByManager,
  getAllPerformanceYears,
  getPerformanceYearById,
  getRatingByPercentage,
  getDepartmentById,
  getPositionGroupById,
} from "./db";
import { drizzle } from "drizzle-orm/mysql2";
import {
  objectives,
  employeePerformances,
  competencyAssessments,
  bonusCalculations,
  performanceYears,
  performanceWeightConfigs,
  evaluationScales,
  behavioralCompetencies,
  letterGradeMappings,
  employees,
  departments,
  positionGroups,
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

async function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  return drizzle(process.env.DATABASE_URL);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PERFORMANCE YEAR PROCEDURES ============
  performanceYear: router({
    getActive: publicProcedure.query(async () => {
      return await getActivePerformanceYear();
    }),

    getAll: protectedProcedure.query(async () => {
      return await getAllPerformanceYears();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getPerformanceYearById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          year: z.number(),
          goalSettingStart: z.string(),
          goalSettingEnd: z.string(),
          midYearReviewStart: z.string(),
          midYearReviewEnd: z.string(),
          endYearReviewStart: z.string(),
          endYearReviewEnd: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can create performance years" });
        }

        const db = await getDb();
        const result = await db.insert(performanceYears).values({
          year: input.year,
          goalSettingStart: new Date(input.goalSettingStart),
          goalSettingEnd: new Date(input.goalSettingEnd),
          midYearReviewStart: new Date(input.midYearReviewStart),
          midYearReviewEnd: new Date(input.midYearReviewEnd),
          endYearReviewStart: new Date(input.endYearReviewStart),
          endYearReviewEnd: new Date(input.endYearReviewEnd),
          isActive: false,
        });

        return result;
      }),

    setActive: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can set active performance year" });
        }

        const db = await getDb();
        // Deactivate all other years
        await db.update(performanceYears).set({ isActive: false });
        // Activate the selected year
        await db.update(performanceYears).set({ isActive: true }).where(eq(performanceYears.id, input.id));

        return { success: true };
      }),
  }),

  // ============ EMPLOYEE PERFORMANCE DASHBOARD ============
  dashboard: router({
    getMyPerformance: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const employee = await getEmployeeByUserId(ctx.user.id);
      if (!employee) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee profile not found" });
      }

      const activeYear = await getActivePerformanceYear();
      if (!activeYear) {
        return {
          employee,
          performance: null,
          objectives: [],
          competencies: [],
          bonusInfo: null,
        };
      }

      const performance = await getEmployeePerformance(employee.id, activeYear.id);
      const objectivesList = await getObjectivesByEmployee(employee.id, activeYear.id);
      const competencies = performance ? await getCompetencyAssessments(performance.id) : [];
      const bonusInfo = performance ? await getBonusCalculation(performance.id) : null;

      return {
        employee,
        performance,
        objectives: objectivesList,
        competencies,
        bonusInfo,
      };
    }),

    getTeamPerformance: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const employee = await getEmployeeByUserId(ctx.user.id);
      if (!employee) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Employee profile not found" });
      }

      if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only managers and admins can view team performance" });
      }

      const team = await getTeamByManager(employee.id);
      const activeYear = await getActivePerformanceYear();

      if (!activeYear) {
        return { team: [], performances: [] };
      }

      const performances = await Promise.all(
        team.map(async (teamMember) => {
          const perf = await getEmployeePerformance(teamMember.id, activeYear.id);
          return { employee: teamMember, performance: perf };
        })
      );

      return { team, performances };
    }),
  }),

  // ============ OBJECTIVES PROCEDURES ============
  objectives: router({
    getByEmployee: protectedProcedure
      .input(z.object({ employeeId: z.number(), performanceYearId: z.number() }))
      .query(async ({ input }) => {
        return await getObjectivesByEmployee(input.employeeId, input.performanceYearId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          employeeId: z.number(),
          performanceYearId: z.number(),
          title: z.string(),
          description: z.string().optional(),
          targetScore: z.number().optional(),
          dueDate: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const manager = await getEmployeeByUserId(ctx.user.id);
        if (!manager) throw new TRPCError({ code: "NOT_FOUND", message: "Manager profile not found" });

        if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only managers can create objectives" });
        }

        const db = await getDb();
        const result = await db.insert(objectives).values({
          employeeId: input.employeeId,
          performanceYearId: input.performanceYearId,
          managerId: manager.id,
          title: input.title,
          description: input.description,
          targetScore: input.targetScore || 0,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          status: "DRAFT",
        });

        return result;
      }),

    submitToEmployee: protectedProcedure
      .input(z.object({ objectiveId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        await db
          .update(objectives)
          .set({
            status: "SUBMITTED",
            managerSubmittedDate: new Date(),
          })
          .where(eq(objectives.id, input.objectiveId));

        return { success: true };
      }),

    approveByEmployee: protectedProcedure
      .input(z.object({ objectiveId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const db = await getDb();
        await db
          .update(objectives)
          .set({
            status: "APPROVED",
            employeeApprovedDate: new Date(),
          })
          .where(eq(objectives.id, input.objectiveId));

        return { success: true };
      }),
  }),

  // ============ COMPETENCY ASSESSMENT PROCEDURES ============
  competency: router({
    getAll: publicProcedure.query(async () => {
      return await getAllBehavioralCompetencies();
    }),

    getAssessments: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number() }))
      .query(async ({ input }) => {
        return await getCompetencyAssessments(input.employeePerformanceId);
      }),

    submitAssessment: protectedProcedure
      .input(
        z.object({
          employeePerformanceId: z.number(),
          competencyId: z.number(),
          assessmentScore: z.number(),
          letterGrade: z.string().optional(),
          assessorComment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        const result = await db.insert(competencyAssessments).values({
          employeePerformanceId: input.employeePerformanceId,
          competencyId: input.competencyId,
          assessmentScore: input.assessmentScore,
          letterGrade: input.letterGrade,
          assessorComment: input.assessorComment,
        });

        return result;
      }),
  }),

  // ============ EVALUATION SCALE PROCEDURES ============
  evaluationScale: router({
    getAll: publicProcedure.query(async () => {
      return await getEvaluationScales();
    }),

    getRatingByPercentage: publicProcedure
      .input(z.object({ percentage: z.number() }))
      .query(async ({ input }) => {
        return await getRatingByPercentage(input.percentage);
      }),
  }),

  // ============ PERFORMANCE SCORE CALCULATION ============
  performanceScore: router({
    calculate: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const db = await getDb();
        const performance = await db
          .select()
          .from(employeePerformances)
          .where(eq(employeePerformances.id, input.employeePerformanceId))
          .limit(1);

        if (!performance.length) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const perf = performance[0];
        const employee = await getEmployeeByUserId(ctx.user.id);
        if (!employee) throw new TRPCError({ code: "NOT_FOUND" });

        const weightConfig = await getPerformanceWeightConfig(employee.positionGroupId);
        if (!weightConfig) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Weight configuration not found" });
        }

        const objectiveScore = parseFloat(perf.objectiveScore || "0");
        const competencyScore = parseFloat(perf.competencyScore || "0");

        const finalScore =
          (objectiveScore * weightConfig.objectivesWeight + competencyScore * weightConfig.competenciesWeight) / 100;

        const rating = await getRatingByPercentage(finalScore);

        await db
          .update(employeePerformances)
          .set({
            finalScore: finalScore.toString(),
            finalRating: rating?.name,
          })
          .where(eq(employeePerformances.id, input.employeePerformanceId));

        return { finalScore, finalRating: rating?.name };
      }),
  }),

  // ============ MID-YEAR REVIEW PROCEDURES ============
  midYearReview: router({
    submitEmployeeComment: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number(), comment: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const db = await getDb();
        await db
          .update(employeePerformances)
          .set({
            midYearEmployeeComment: input.comment,
            midYearEmployeeDraftSaved: new Date(),
          })
          .where(eq(employeePerformances.id, input.employeePerformanceId));

        return { success: true };
      }),

    submitManagerComment: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number(), comment: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        await db
          .update(employeePerformances)
          .set({
            midYearManagerComment: input.comment,
            midYearManagerDraftSaved: new Date(),
            midYearCompleted: true,
          })
          .where(eq(employeePerformances.id, input.employeePerformanceId));

        return { success: true };
      }),
  }),

  // ============ END-YEAR REVIEW PROCEDURES ============
  endYearReview: router({
    submitEmployeeComment: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number(), comment: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        const db = await getDb();
        await db
          .update(employeePerformances)
          .set({
            endYearEmployeeComment: input.comment,
            endYearEmployeeDraftSaved: new Date(),
          })
          .where(eq(employeePerformances.id, input.employeePerformanceId));

        return { success: true };
      }),

    submitManagerComment: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number(), comment: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "manager" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        await db
          .update(employeePerformances)
          .set({
            endYearManagerComment: input.comment,
            endYearManagerDraftSaved: new Date(),
            endYearCompleted: true,
          })
          .where(eq(employeePerformances.id, input.employeePerformanceId));

        return { success: true };
      }),
  }),

  // ============ BONUS CALCULATION PROCEDURES ============
  bonus: router({
    getByPerformance: protectedProcedure
      .input(z.object({ employeePerformanceId: z.number() }))
      .query(async ({ input }) => {
        return await getBonusCalculation(input.employeePerformanceId);
      }),

    calculate: protectedProcedure
      .input(
        z.object({
          employeePerformanceId: z.number(),
          baseSalary: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        const performance = await db
          .select()
          .from(employeePerformances)
          .where(eq(employeePerformances.id, input.employeePerformanceId))
          .limit(1);

        if (!performance.length) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        const finalScore = parseFloat(performance[0].finalScore || "0");
        const performancePercentage = Math.min(finalScore, 100);
        const bonusAmount = (input.baseSalary * performancePercentage) / 100;

        const result = await db.insert(bonusCalculations).values({
          employeePerformanceId: input.employeePerformanceId,
          baseSalary: input.baseSalary.toString(),
          performancePercentage: performancePercentage.toString(),
          bonusAmount: bonusAmount.toString(),
          status: "CALCULATED",
        });

        return result;
      }),

    approve: protectedProcedure
      .input(z.object({ bonusId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const db = await getDb();
        await db
          .update(bonusCalculations)
          .set({
            status: "APPROVED",
            approvedDate: new Date(),
          })
          .where(eq(bonusCalculations.id, input.bonusId));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
