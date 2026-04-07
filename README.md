# Performance Management System

A comprehensive web-based platform for managing employee performance throughout the annual review cycle. This system supports goal setting, mid-year reviews, end-year evaluations, competency assessments, and bonus calculations.

## Features

**Core Functionality:**
- **Performance Year Management:** Configure annual review cycles with goal setting, mid-year, and end-year review periods
- **Objective Management:** Managers create objectives, employees approve them, and track progress
- **Mid-Year Reviews:** Conduct mid-year check-ins with employee and manager comments
- **End-Year Reviews:** Comprehensive end-of-year performance evaluation and rating
- **Competency Assessment:** Evaluate behavioral competencies with letter grades (E++, E+, E, E-, E--)
- **Performance Scoring:** Automatic calculation of final scores based on objectives and competencies weights
- **Bonus Calculation:** Calculate employee bonuses based on final performance scores

**Role-Based Access Control:**
- **Admin:** System configuration, performance year setup, evaluation scales, weight configuration
- **Manager:** Team performance management, objective creation, mid-year and end-year reviews
- **Employee:** Personal performance tracking, objective approval, self-assessments

## Technology Stack

**Frontend:**
- React 19 with TypeScript
- TailwindCSS 4 for styling
- shadcn/ui components
- tRPC for type-safe API calls
- Wouter for routing

**Backend:**
- Node.js with Express
- tRPC for API procedures
- Drizzle ORM for database access
- MySQL/TiDB database

**Deployment:**
- Vercel for hosting
- Environment-based configuration

## Project Structure

```
performance-management-system/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── pages/            # Page components (Admin, Manager, Employee dashboards)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utilities (tRPC client)
│   │   └── App.tsx           # Main routing
│   └── public/               # Static assets
├── server/                    # Backend API
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   └── _core/                # Core framework files
├── drizzle/                  # Database schema and migrations
│   ├── schema.ts             # Table definitions
│   └── migrations/           # SQL migration files
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies and scripts
```

## Database Schema

**Core Tables:**
- `users` - User accounts with role-based access
- `employees` - Employee profiles with department and position group
- `departments` - Department definitions
- `position_groups` - Position group classifications
- `performance_years` - Annual review cycle configuration
- `objectives` - Performance objectives with approval workflow
- `employee_performances` - Main performance tracking record
- `competency_assessments` - Behavioral competency evaluations
- `evaluation_scales` - Rating scale definitions (E++, E+, E, E-, E--)
- `performance_weight_configs` - Objectives vs competencies weight by position
- `bonus_calculations` - Bonus amount calculations

## API Procedures

### Performance Year Management
- `performanceYear.getActive()` - Get active performance year
- `performanceYear.getAll()` - List all performance years
- `performanceYear.create()` - Create new performance year (Admin only)
- `performanceYear.setActive()` - Activate a performance year (Admin only)

### Dashboard
- `dashboard.getMyPerformance()` - Get current user's performance
- `dashboard.getTeamPerformance()` - Get team performance (Manager/Admin only)

### Objectives
- `objectives.getByEmployee()` - Get objectives for an employee
- `objectives.create()` - Create new objective (Manager/Admin only)
- `objectives.submitToEmployee()` - Submit objective to employee
- `objectives.approveByEmployee()` - Employee approves objective

### Competencies
- `competency.getAll()` - Get all behavioral competencies
- `competency.getAssessments()` - Get competency assessments
- `competency.submitAssessment()` - Submit competency assessment (Manager/Admin only)

### Reviews
- `midYearReview.submitEmployeeComment()` - Employee submits mid-year comment
- `midYearReview.submitManagerComment()` - Manager submits mid-year comment
- `endYearReview.submitEmployeeComment()` - Employee submits end-year comment
- `endYearReview.submitManagerComment()` - Manager submits end-year comment

### Performance Scoring
- `performanceScore.calculate()` - Calculate final performance score
- `evaluationScale.getAll()` - Get evaluation scales
- `evaluationScale.getRatingByPercentage()` - Get rating for a percentage

### Bonus Calculation
- `bonus.getByPerformance()` - Get bonus calculation
- `bonus.calculate()` - Calculate bonus amount (Admin only)
- `bonus.approve()` - Approve bonus (Admin only)

## Setup & Development

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL/TiDB database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Copy .env.example to .env and fill in required values
cp .env.example .env

# Generate database migrations
pnpm drizzle-kit generate

# Run development server
pnpm dev
```

### Build for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Required environment variables for deployment:

```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=owner-id
OWNER_NAME=Owner Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

## Deployment to Vercel

### Prerequisites
- GitHub account with repository access
- Vercel account

### Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the project root directory

3. **Configure Environment Variables:**
   - In Vercel project settings, add all required environment variables
   - Ensure DATABASE_URL points to your production database

4. **Deploy:**
   - Vercel will automatically build and deploy on push
   - Access your app at `https://your-project.vercel.app`

## Annual Review Cycle

### Phase 1: Goal Setting (Q1)
- Managers create objectives for their team members
- Employees review and approve objectives
- Set performance targets and due dates

### Phase 2: Mid-Year Review (Q2-Q3)
- Employees submit self-assessment comments
- Managers provide feedback and comments
- Assess progress on objectives

### Phase 3: End-Year Review (Q4)
- Final performance scoring based on objectives and competencies
- Employees submit year-end self-assessment
- Managers provide final ratings and comments
- Bonus calculations based on final scores

## Testing

Run tests with:
```bash
pnpm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please contact the development team.
