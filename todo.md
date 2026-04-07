# Performance Management System - TODO

## Backend - Database Schema
- [x] Employee model with department and position group
- [x] Department model
- [x] PositionGroup model
- [x] PerformanceYear model with period management
- [x] PerformanceWeightConfig model (objectives vs competencies weights)
- [x] EvaluationScale model (E++, E+, E, E-, E--)
- [x] LetterGradeMapping model for competency assessment
- [x] BehavioralCompetency model
- [x] Objective model with approval workflow
- [x] EmployeePerformance model (main tracking)
- [x] CompetencyAssessment model
- [x] BonusCalculation model

## Backend - API Procedures
- [x] Performance year management (create, list, set active)
- [x] Employee objectives CRUD with approval workflow
- [x] Mid-year review submission and retrieval
- [x] End-year review submission and retrieval
- [x] Performance score calculation (objectives + competencies)
- [x] Competency assessment management
- [x] Bonus calculation based on performance
- [ ] Department and position group management
- [ ] Performance weight configuration
- [ ] Evaluation scale configuration
- [x] Role-based access control (Admin, Manager, Employee)

## Frontend - Authentication & Layout
- [x] User authentication integration
- [x] Role-based navigation (Admin, Manager, Employee)
- [x] DashboardLayout with sidebar navigation
- [x] User profile and logout functionality

## Frontend - Admin Pages
- [x] Performance year configuration page
- [ ] Performance weight configuration by position group
- [ ] Evaluation scale management
- [ ] Department and position group management
- [ ] User management and role assignment

## Frontend - Manager Pages
- [x] Manager dashboard with team overview
- [ ] Objectives creation and submission to employees
- [ ] Mid-year review submission
- [ ] End-year review submission
- [ ] Team performance analytics

## Frontend - Employee Pages
- [x] Employee dashboard with personal performance
- [x] Objectives approval workflow
- [x] Mid-year self-assessment
- [x] End-year self-assessment
- [ ] Performance history and feedback

## Frontend - Shared Components
- [ ] Performance score display component
- [ ] Evaluation scale visualization
- [ ] Objective card component
- [ ] Review period status indicator
- [ ] Performance timeline component

## Testing
- [ ] Backend API tests (vitest)
- [ ] Frontend component tests

## Deployment
- [x] Vercel configuration (vercel.json)
- [x] Environment variables setup
- [ ] GitHub repository update
- [ ] Deployment testing

