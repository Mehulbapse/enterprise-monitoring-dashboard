# Enterprise Monitoring Dashboard

A comprehensive Angular-based monitoring dashboard for enterprise system health, alerts management, and real-time metrics visualization. This application provides administrators with a centralized view of system performance, critical alerts, and user activity.

## Features

- **Real-Time Dashboard**: Displays KPI cards showing Total Alerts, Active Users, System Health, and Response Time
- **Interactive Charts**:
  - Line chart for real-time system load
  - Bar chart for system metrics (CPU, Memory, Disk)
  - Pie chart for alert distribution
- **Alert Management**:
  - Filterable alerts table with search, severity, and status filters
  - Pagination support with dynamic page reset on filter changes
  - Sortable columns
- **User Authentication**: Login system with JWT token support
- **Theme Management**: Support for light/dark theme switching
- **Responsive Design**: Mobile-friendly UI with SCSS styling
- **Mock API Integration**: Built-in mock API interceptor for development

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core functionality
│   │   ├── guards/                    # Route guards (auth)
│   │   ├── interceptors/              # HTTP interceptors (auth, mock API)
│   │   ├── models/                    # TypeScript interfaces and models
│   │   └── services/                  # Core services (auth, dashboard, theme)
│   ├── features/                      # Feature modules
│   │   ├── auth/                      # Authentication module
│   │   │   └── login/                 # Login component
│   │   └── dashboard/                 # Dashboard module
│   ├── shared/                        # Shared components
│   │   └── components/                # Reusable UI components
│   │       ├── chart/                 # Chart component
│   │       ├── data-table/            # Data table component
│   │       └── kpi-card/              # KPI card component
│   └── layout/                        # Layout components
│       └── header/                    # Header component
└── environments/                      # Environment configurations
```

## Technologies Used

- **Angular 21.2.10**: Standalone components and latest Angular features
- **TypeScript 5.9.2**: Strong typing and modern JavaScript features
- **RxJS 7.8**: Reactive programming with Observables
- **Chart.js 4.5.1**: Interactive chart library
- **SCSS**: Advanced styling with variables and mixins
- **Reactive Forms**: Reactive form handling for filters and search
- **npm 10.8.2**: Package manager

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v10.8.2 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd enterprise-monitoring-dashboard
```

2. Install dependencies:

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building for Production

Build the project for production:

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Key Features Explained

### Dashboard

- **KPI Cards**: Quick overview of system metrics
- **Charts**: Visual representation of system load, metrics, and alert distribution
- **Alerts Table**: Detailed view of all alerts with filtering capabilities

### Alert Filtering

- **Search**: Search by alert message, source, or ID
- **Severity Filter**: Filter by Critical, Warning, or Info levels
- **Status Filter**: Filter by Active, Acknowledged, or Resolved status
- **Smart Pagination**: Automatically resets to page 1 when filters change

### Authentication

- Login with username and password
- JWT token-based authentication
- Protected routes with auth guards

## API Integration

The application uses a mock API interceptor for development. The interceptor handles:

- `/auth/login` - User authentication
- `/dashboard/kpi` - KPI data
- `/dashboard/timeseries` - Time series data for line chart
- `/dashboard/metrics` - System metrics for bar chart
- `/dashboard/distribution` - Alert distribution data
- `/dashboard/alerts` - Paginated alerts with filtering and sorting

### Mock Interceptor

Project Used Mock Interceptor for data

## Configuration

### Environment Variables

Update `src/environments/environments.ts` for development and `src/environments/environments.prod.ts` for production:

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  refreshInterval: 30000, // Auto-refresh interval in ms
};
```

## Best Practices Implemented

- **Standalone Components**: Modern Angular component architecture
- **Reactive Programming**: RxJS observables for data flow
- **Change Detection Strategy**: OnPush for performance optimization
- **Type Safety**: Full TypeScript typing throughout the application
- **Code Organization**: Feature-based folder structure
- **Reusable Components**: Shared components for UI consistency

## Known Issues & Fixes

- Fixed: `setUpAlertStream` method not being called (was missing parentheses)
- Fixed: Status filter sending wrong value to API
- Fixed: Pagination not resetting on filter changes
- Fixed: Mismatch between filter options and mock data values

## Future Enhancements

- Real backend API integration
- Advanced filtering with date range
- Export alerts to CSV/PDF
- Dashboard customization and widgets
- Real-time WebSocket updates
- User preference saving
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
