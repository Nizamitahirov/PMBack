import { eq, and, or, desc, asc, between, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  employees,
  departments,
  positionGroups,
  performanceYears,
  performanceWeightConfigs,
  evaluationScales,
  behavioralCompetencies,
  letterGradeMappings,
  objectives,
  employeePerformances,
  competencyAssessments,
  bonusCalculations,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ EMPLOYEE QUERIES ============

export async function getEmployeeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(employees)
    .where(eq(employees.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeById(employeeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getTeamByManager(managerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(employees)
    .where(eq(employees.managerId, managerId));
}

// ============ PERFORMANCE YEAR QUERIES ============

export async function getActivePerformanceYear() {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(performanceYears)
    .where(eq(performanceYears.isActive, true))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPerformanceYearById(yearId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(performanceYears)
    .where(eq(performanceYears.id, yearId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllPerformanceYears() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(performanceYears).orderBy(desc(performanceYears.year));
}

// ============ OBJECTIVE QUERIES ============

export async function getObjectivesByEmployee(employeeId: number, performanceYearId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(objectives)
    .where(and(eq(objectives.employeeId, employeeId), eq(objectives.performanceYearId, performanceYearId)));
}

export async function getObjectiveById(objectiveId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(objectives)
    .where(eq(objectives.id, objectiveId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ EMPLOYEE PERFORMANCE QUERIES ============

export async function getEmployeePerformance(employeeId: number, performanceYearId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(employeePerformances)
    .where(and(eq(employeePerformances.employeeId, employeeId), eq(employeePerformances.performanceYearId, performanceYearId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeePerformanceById(performanceId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(employeePerformances)
    .where(eq(employeePerformances.id, performanceId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ COMPETENCY QUERIES ============

export async function getCompetencyAssessments(employeePerformanceId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(competencyAssessments)
    .where(eq(competencyAssessments.employeePerformanceId, employeePerformanceId));
}

export async function getAllBehavioralCompetencies() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(behavioralCompetencies)
    .where(eq(behavioralCompetencies.isActive, true));
}

// ============ EVALUATION SCALE QUERIES ============

export async function getEvaluationScales() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(evaluationScales)
    .where(eq(evaluationScales.isActive, true))
    .orderBy(desc(evaluationScales.rangeMin));
}

export async function getRatingByPercentage(percentage: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(evaluationScales)
    .where(
      and(
        eq(evaluationScales.isActive, true),
        sql`${evaluationScales.rangeMin} <= ${percentage} AND ${percentage} <= ${evaluationScales.rangeMax}`
      )
    )
    .orderBy(asc(evaluationScales.rangeMin))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PERFORMANCE WEIGHT CONFIG QUERIES ============

export async function getPerformanceWeightConfig(positionGroupId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(performanceWeightConfigs)
    .where(eq(performanceWeightConfigs.positionGroupId, positionGroupId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ BONUS CALCULATION QUERIES ============

export async function getBonusCalculation(employeePerformanceId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(bonusCalculations)
    .where(eq(bonusCalculations.employeePerformanceId, employeePerformanceId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ DEPARTMENT QUERIES ============

export async function getDepartmentById(departmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPositionGroupById(positionGroupId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(positionGroups)
    .where(eq(positionGroups.id, positionGroupId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
