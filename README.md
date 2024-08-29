# FlightBooking Application

## Description

This project is a flight booking application built with React for the frontend and Express.js for the backend API. It is written in TypeScript, and uses React Router for navigation, Tailwind CSS and ShadCN for styling and components. The backend uses PostgreSQL as the database, with Prisma as the ORM to manage and generate migration files. The application is fully dockerized to simplify setup, including automatic database migrations and seeding.

## Project Structure

- `frontend/`: Contains the React frontend code.
- `backend/`: Contains the Express.js backend API code.
- `docker-compose.yml`: Docker Compose file to run the entire application.

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose

### Steps to Set Up and Run the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lwinhtet/FlightBooking.git
   cd FlightBooking
   ```

2. **Build and run the Docker containers:**
   ```bash
   docker-compose up --build
   ```

## Wait for the Setup to Complete

It might take around 20-30 seconds to build the containers, run migrations, and seed the database with mock data.

## Access the Application

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)

## Assumptions

- The application is meant to run locally using Docker.
- Mock data is automatically generated for testing purposes.

## Notes

- I chose this stack because it allows for the separation of the application, API, and database, making it more scalable and flexible. While this approach may be harder to manage, it provides full control over the application’s components.
- I could have used PHP/Laravel, where I have over 3 years of experience, or Java with Spring, which I’m currently working on to improve proficiency. Each stack has its own pros and cons, but my primary goal is to solve the problem effectively and build a robust and efficient system.
- If you encounter any issues during testing, feel free to contact me.
