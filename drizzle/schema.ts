import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  unique,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "manager", "employee"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Department model
 */
export const departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;

/**
 * Position Group model
 */
export const positionGroups = mysqlTable("position_groups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PositionGroup = typeof positionGroups.$inferSelect;
export type InsertPositionGroup = typeof positionGroups.$inferInsert;

/**
 * Employee model
 */
export const employees = mysqlTable(
  "employees",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    employeeCode: varchar("employeeCode", { length: 50 }).notNull().unique(),
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    departmentId: int("departmentId").notNull(),
    positionGroupId: int("positionGroupId").notNull(),
    managerId: int("managerId"),
    joinDate: date("joinDate"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_department").on(table.departmentId),
    index("idx_position_group").on(table.positionGroupId),
    index("idx_manager").on(table.managerId),
  ]
);

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Performance Year model
 */
export const performanceYears = mysqlTable("performance_years", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull().unique(),
  isActive: boolean("isActive").default(false).notNull(),
  goalSettingStart: date("goalSettingStart").notNull(),
  goalSettingEnd: date("goalSettingEnd").notNull(),
  midYearReviewStart: date("midYearReviewStart").notNull(),
  midYearReviewEnd: date("midYearReviewEnd").notNull(),
  endYearReviewStart: date("endYearReviewStart").notNull(),
  endYearReviewEnd: date("endYearReviewEnd").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PerformanceYear = typeof performanceYears.$inferSelect;
export type InsertPerformanceYear = typeof performanceYears.$inferInsert;

/**
 * Performance Weight Configuration
 */
export const performanceWeightConfigs = mysqlTable(
  "performance_weight_configs",
  {
    id: int("id").autoincrement().primaryKey(),
    positionGroupId: int("positionGroupId").notNull().unique(),
    objectivesWeight: int("objectivesWeight").notNull(),
    competenciesWeight: int("competenciesWeight").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_position_group").on(table.positionGroupId)]
);

export type PerformanceWeightConfig = typeof performanceWeightConfigs.$inferSelect;
export type InsertPerformanceWeightConfig = typeof performanceWeightConfigs.$inferInsert;

/**
 * Evaluation Scale model
 */
export const evaluationScales = mysqlTable(
  "evaluation_scales",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 10 }).notNull().unique(),
    value: int("value").notNull(),
    rangeMin: int("rangeMin").notNull(),
    rangeMax: int("rangeMax").notNull(),
    description: text("description"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_range").on(table.rangeMin, table.rangeMax)]
);

export type EvaluationScale = typeof evaluationScales.$inferSelect;
export type InsertEvaluationScale = typeof evaluationScales.$inferInsert;

/**
 * Behavioral Competency model
 */
export const behavioralCompetencies = mysqlTable("behavioral_competencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BehavioralCompetency = typeof behavioralCompetencies.$inferSelect;
export type InsertBehavioralCompetency = typeof behavioralCompetencies.$inferInsert;

/**
 * Letter Grade Mapping for competency assessment
 */
export const letterGradeMappings = mysqlTable(
  "letter_grade_mappings",
  {
    id: int("id").autoincrement().primaryKey(),
    competencyId: int("competencyId").notNull(),
    grade: varchar("grade", { length: 10 }).notNull(),
    scoreMin: int("scoreMin").notNull(),
    scoreMax: int("scoreMax").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_competency").on(table.competencyId),
    unique("unique_competency_grade").on(table.competencyId, table.grade),
  ]
);

export type LetterGradeMapping = typeof letterGradeMappings.$inferSelect;
export type InsertLetterGradeMapping = typeof letterGradeMappings.$inferInsert;

/**
 * Objective model
 */
export const objectives = mysqlTable(
  "objectives",
  {
    id: int("id").autoincrement().primaryKey(),
    performanceYearId: int("performanceYearId").notNull(),
    employeeId: int("employeeId").notNull(),
    managerId: int("managerId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    targetScore: int("targetScore").default(0),
    actualScore: int("actualScore"),
    status: mysqlEnum("status", ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "COMPLETED"]).default("DRAFT"),
    managerSubmittedDate: timestamp("managerSubmittedDate"),
    employeeApprovedDate: timestamp("employeeApprovedDate"),
    managerApprovedDate: timestamp("managerApprovedDate"),
    dueDate: date("dueDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_performance_year").on(table.performanceYearId),
    index("idx_employee").on(table.employeeId),
    index("idx_manager").on(table.managerId),
  ]
);

export type Objective = typeof objectives.$inferSelect;
export type InsertObjective = typeof objectives.$inferInsert;

/**
 * Employee Performance model (main tracking)
 */
export const employeePerformances = mysqlTable(
  "employee_performances",
  {
    id: int("id").autoincrement().primaryKey(),
    employeeId: int("employeeId").notNull(),
    performanceYearId: int("performanceYearId").notNull(),
    approvalStatus: mysqlEnum("approvalStatus", [
      "DRAFT",
      "PENDING_EMPLOYEE_APPROVAL",
      "NEED_CLARIFICATION",
      "APPROVED",
      "COMPLETED",
    ]).default("DRAFT"),
    objectivesDraftSavedDate: timestamp("objectivesDraftSavedDate"),
    objectivesEmployeeSubmitted: boolean("objectivesEmployeeSubmitted").default(false),
    objectivesEmployeeSubmittedDate: timestamp("objectivesEmployeeSubmittedDate"),
    objectivesEmployeeApproved: boolean("objectivesEmployeeApproved").default(false),
    objectivesEmployeeApprovedDate: timestamp("objectivesEmployeeApprovedDate"),
    objectivesManagerApproved: boolean("objectivesManagerApproved").default(false),
    objectivesManagerApprovedDate: timestamp("objectivesManagerApprovedDate"),
    objectivesDeadline: date("objectivesDeadline"),
    competenciesDraftSavedDate: timestamp("competenciesDraftSavedDate"),
    competenciesSubmitted: boolean("competenciesSubmitted").default(false),
    competenciesSubmittedDate: timestamp("competenciesSubmittedDate"),
    midYearEmployeeComment: text("midYearEmployeeComment"),
    midYearEmployeeDraftSaved: timestamp("midYearEmployeeDraftSaved"),
    midYearEmployeeSubmitted: timestamp("midYearEmployeeSubmitted"),
    midYearManagerComment: text("midYearManagerComment"),
    midYearManagerDraftSaved: timestamp("midYearManagerDraftSaved"),
    midYearManagerSubmitted: timestamp("midYearManagerSubmitted"),
    midYearCompleted: boolean("midYearCompleted").default(false),
    endYearEmployeeComment: text("endYearEmployeeComment"),
    endYearEmployeeDraftSaved: timestamp("endYearEmployeeDraftSaved"),
    endYearEmployeeSubmitted: timestamp("endYearEmployeeSubmitted"),
    endYearManagerComment: text("endYearManagerComment"),
    endYearManagerDraftSaved: timestamp("endYearManagerDraftSaved"),
    endYearManagerSubmitted: timestamp("endYearManagerSubmitted"),
    endYearCompleted: boolean("endYearCompleted").default(false),
    objectiveScore: decimal("objectiveScore", { precision: 5, scale: 2 }).default("0"),
    competencyScore: decimal("competencyScore", { precision: 5, scale: 2 }).default("0"),
    finalScore: decimal("finalScore", { precision: 5, scale: 2 }).default("0"),
    finalRating: varchar("finalRating", { length: 10 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_employee").on(table.employeeId),
    index("idx_performance_year").on(table.performanceYearId),
    unique("unique_employee_year").on(table.employeeId, table.performanceYearId),
  ]
);

export type EmployeePerformance = typeof employeePerformances.$inferSelect;
export type InsertEmployeePerformance = typeof employeePerformances.$inferInsert;

/**
 * Competency Assessment model
 */
export const competencyAssessments = mysqlTable(
  "competency_assessments",
  {
    id: int("id").autoincrement().primaryKey(),
    employeePerformanceId: int("employeePerformanceId").notNull(),
    competencyId: int("competencyId").notNull(),
    assessmentScore: int("assessmentScore"),
    letterGrade: varchar("letterGrade", { length: 10 }),
    assessorComment: text("assessorComment"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_performance").on(table.employeePerformanceId),
    index("idx_competency").on(table.competencyId),
  ]
);

export type CompetencyAssessment = typeof competencyAssessments.$inferSelect;
export type InsertCompetencyAssessment = typeof competencyAssessments.$inferInsert;

/**
 * Bonus Calculation model
 */
export const bonusCalculations = mysqlTable(
  "bonus_calculations",
  {
    id: int("id").autoincrement().primaryKey(),
    employeePerformanceId: int("employeePerformanceId").notNull().unique(),
    baseSalary: decimal("baseSalary", { precision: 12, scale: 2 }),
    performancePercentage: decimal("performancePercentage", { precision: 5, scale: 2 }).default("0"),
    bonusAmount: decimal("bonusAmount", { precision: 12, scale: 2 }).default("0"),
    status: mysqlEnum("status", ["CALCULATED", "APPROVED", "PAID"]).default("CALCULATED"),
    approvedDate: timestamp("approvedDate"),
    paidDate: timestamp("paidDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_performance").on(table.employeePerformanceId)]
);

export type BonusCalculation = typeof bonusCalculations.$inferSelect;
export type InsertBonusCalculation = typeof bonusCalculations.$inferInsert;
