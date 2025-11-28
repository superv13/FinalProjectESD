# Faculty Management System (ESD Final Project)

A comprehensive web application for managing faculty members, courses, and departments. Built with a Spring Boot backend and a React frontend.

## Features

- **User Authentication**: Secure login with JWT and Google OAuth2 integration.
- **Dashboard**: Overview of key metrics and quick actions.
- **Employee Directory**: Browse faculty members with a beautiful, card-based interface.
- **Employee Details**: View detailed profiles including assigned courses.
- **My Profile**: Personal profile management for logged-in users.
- **Update Profile**: Edit personal details, assign courses, and manage department (Admin only).
- **Course Management**: View and assign courses to faculty.
- **Responsive Design**: Modern UI built with React and Tailwind CSS.

## Tech Stack

### Frontend
- **React.js**: Component-based UI library.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for API requests.

### Backend
- **Java Spring Boot**: REST API framework.
- **Spring Security**: Authentication and authorization.
- **Spring Data JPA**: Database interaction.
- **MySQL**: Relational database.
- **JWT**: Stateless authentication.

## Setup Instructions

### Prerequisites
- Node.js & npm
- Java JDK 17+
- Maven
- MySQL Server

### 1. Database Setup
1. Create a MySQL database named `esd_project` (or update `application.properties` with your DB name).
2. The backend will automatically create tables on the first run (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd ESDBackend-master
   ```
2. Update `src/main/resources/application.properties` with your database credentials and Google OAuth secrets.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8081`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd esd-mini-frontend-master
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`.

## Default Credentials
- **Admin User**: (If seeded) `admin@school.edu` / `password`
- **Regular User**: Register or use seeded data.

## Screenshots
*(Add screenshots of Dashboard, Directory, and Profile here)*

## License
This project is for educational purposes as part of the ESD course.
