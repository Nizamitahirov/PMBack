CREATE TABLE `behavioral_competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `behavioral_competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bonus_calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeePerformanceId` int NOT NULL,
	`baseSalary` decimal(12,2),
	`performancePercentage` decimal(5,2) DEFAULT '0',
	`bonusAmount` decimal(12,2) DEFAULT '0',
	`status` enum('CALCULATED','APPROVED','PAID') DEFAULT 'CALCULATED',
	`approvedDate` timestamp,
	`paidDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bonus_calculations_id` PRIMARY KEY(`id`),
	CONSTRAINT `bonus_calculations_employeePerformanceId_unique` UNIQUE(`employeePerformanceId`)
);
--> statement-breakpoint
CREATE TABLE `competency_assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeePerformanceId` int NOT NULL,
	`competencyId` int NOT NULL,
	`assessmentScore` int,
	`letterGrade` varchar(10),
	`assessorComment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competency_assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`),
	CONSTRAINT `departments_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `employee_performances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`performanceYearId` int NOT NULL,
	`approvalStatus` enum('DRAFT','PENDING_EMPLOYEE_APPROVAL','NEED_CLARIFICATION','APPROVED','COMPLETED') DEFAULT 'DRAFT',
	`objectivesDraftSavedDate` timestamp,
	`objectivesEmployeeSubmitted` boolean DEFAULT false,
	`objectivesEmployeeSubmittedDate` timestamp,
	`objectivesEmployeeApproved` boolean DEFAULT false,
	`objectivesEmployeeApprovedDate` timestamp,
	`objectivesManagerApproved` boolean DEFAULT false,
	`objectivesManagerApprovedDate` timestamp,
	`objectivesDeadline` date,
	`competenciesDraftSavedDate` timestamp,
	`competenciesSubmitted` boolean DEFAULT false,
	`competenciesSubmittedDate` timestamp,
	`midYearEmployeeComment` text,
	`midYearEmployeeDraftSaved` timestamp,
	`midYearEmployeeSubmitted` timestamp,
	`midYearManagerComment` text,
	`midYearManagerDraftSaved` timestamp,
	`midYearManagerSubmitted` timestamp,
	`midYearCompleted` boolean DEFAULT false,
	`endYearEmployeeComment` text,
	`endYearEmployeeDraftSaved` timestamp,
	`endYearEmployeeSubmitted` timestamp,
	`endYearManagerComment` text,
	`endYearManagerDraftSaved` timestamp,
	`endYearManagerSubmitted` timestamp,
	`endYearCompleted` boolean DEFAULT false,
	`objectiveScore` decimal(5,2) DEFAULT '0',
	`competencyScore` decimal(5,2) DEFAULT '0',
	`finalScore` decimal(5,2) DEFAULT '0',
	`finalRating` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_performances_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_employee_year` UNIQUE(`employeeId`,`performanceYearId`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`employeeCode` varchar(50) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`departmentId` int NOT NULL,
	`positionGroupId` int NOT NULL,
	`managerId` int,
	`joinDate` date,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `employees_employeeCode_unique` UNIQUE(`employeeCode`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_scales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(10) NOT NULL,
	`value` int NOT NULL,
	`rangeMin` int NOT NULL,
	`rangeMax` int NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluation_scales_id` PRIMARY KEY(`id`),
	CONSTRAINT `evaluation_scales_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `letter_grade_mappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competencyId` int NOT NULL,
	`grade` varchar(10) NOT NULL,
	`scoreMin` int NOT NULL,
	`scoreMax` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `letter_grade_mappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_competency_grade` UNIQUE(`competencyId`,`grade`)
);
--> statement-breakpoint
CREATE TABLE `objectives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`performanceYearId` int NOT NULL,
	`employeeId` int NOT NULL,
	`managerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`targetScore` int DEFAULT 0,
	`actualScore` int,
	`status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED','COMPLETED') DEFAULT 'DRAFT',
	`managerSubmittedDate` timestamp,
	`employeeApprovedDate` timestamp,
	`managerApprovedDate` timestamp,
	`dueDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `objectives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_weight_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`positionGroupId` int NOT NULL,
	`objectivesWeight` int NOT NULL,
	`competenciesWeight` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_weight_configs_id` PRIMARY KEY(`id`),
	CONSTRAINT `performance_weight_configs_positionGroupId_unique` UNIQUE(`positionGroupId`)
);
--> statement-breakpoint
CREATE TABLE `performance_years` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT false,
	`goalSettingStart` date NOT NULL,
	`goalSettingEnd` date NOT NULL,
	`midYearReviewStart` date NOT NULL,
	`midYearReviewEnd` date NOT NULL,
	`endYearReviewStart` date NOT NULL,
	`endYearReviewEnd` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_years_id` PRIMARY KEY(`id`),
	CONSTRAINT `performance_years_year_unique` UNIQUE(`year`)
);
--> statement-breakpoint
CREATE TABLE `position_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `position_groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `position_groups_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','manager','employee') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `idx_performance` ON `bonus_calculations` (`employeePerformanceId`);--> statement-breakpoint
CREATE INDEX `idx_performance` ON `competency_assessments` (`employeePerformanceId`);--> statement-breakpoint
CREATE INDEX `idx_competency` ON `competency_assessments` (`competencyId`);--> statement-breakpoint
CREATE INDEX `idx_employee` ON `employee_performances` (`employeeId`);--> statement-breakpoint
CREATE INDEX `idx_performance_year` ON `employee_performances` (`performanceYearId`);--> statement-breakpoint
CREATE INDEX `idx_department` ON `employees` (`departmentId`);--> statement-breakpoint
CREATE INDEX `idx_position_group` ON `employees` (`positionGroupId`);--> statement-breakpoint
CREATE INDEX `idx_manager` ON `employees` (`managerId`);--> statement-breakpoint
CREATE INDEX `idx_range` ON `evaluation_scales` (`rangeMin`,`rangeMax`);--> statement-breakpoint
CREATE INDEX `idx_competency` ON `letter_grade_mappings` (`competencyId`);--> statement-breakpoint
CREATE INDEX `idx_performance_year` ON `objectives` (`performanceYearId`);--> statement-breakpoint
CREATE INDEX `idx_employee` ON `objectives` (`employeeId`);--> statement-breakpoint
CREATE INDEX `idx_manager` ON `objectives` (`managerId`);--> statement-breakpoint
CREATE INDEX `idx_position_group` ON `performance_weight_configs` (`positionGroupId`);