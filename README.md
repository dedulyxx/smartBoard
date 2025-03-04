# TaskFlow - Task Management Application

TaskFlow is a modern task management application with a React frontend and Golang backend, using PostgreSQL for data storage.

## Features

- Kanban board with drag-and-drop functionality
- Task creation and management
- Task prioritization
- Task comments
- User assignment
- Authentication and authorization (admin/user roles)
- Multiple board views (Kanban, Gantt)

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Beautiful DnD for drag-and-drop functionality
- Axios for API requests
- Lucide React for icons
- React Router for routing
- JWT for authentication

### Backend
- Golang
- Gorilla Mux for routing
- PostgreSQL database
- JWT for authentication

## Docker Setup

The entire application is containerized using Docker Compose, making it easy to run the complete stack with a single command.

### Prerequisites
- Docker and Docker Compose

### Running the Application

1. Clone the repository
2. Run the application:
```bash
docker-compose up
```
3. Access the application at http://localhost:3000

## Authentication

- The first registered user will automatically become an admin
- Admins can:
  - Create and assign tasks
  - Modify task details
  - Add new columns
- Regular users can:
  - View tasks
  - Move tasks between columns (update status)
  - Add comments

## Project Structure

```
├── src/                  # Frontend source code
│   ├── api/              # API client
│   ├── assets/           # Static assets
│   ├── components/       # React components
│   ├── context/          # React context (auth)
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
├── backend/              # Backend source code
│   ├── database/         # Database schema and migrations
│   └── main.go           # Main application entry point
└── docker-compose.yml    # Docker Compose configuration
```

## License

MIT# smartBoard
