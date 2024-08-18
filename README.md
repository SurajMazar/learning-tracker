Here's the updated README file with the API documentation section:

---

# Learning Tracker

**Learning Tracker** is a course management system that allows users to upload course videos and track their progress. The backend is built with AdonisJS, and the data is stored in a PostgreSQL database. MinIO is used for media storage, and Docker Compose is utilized to manage services.

## Features

- Upload course videos
- Track course completion progress
- MinIO for file storage
- PostgreSQL database for managing data

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (version 20 or later)
- **AdonisJS** (v6)
- **Docker** (for containerization)
- **Docker Compose** (for multi-container setups)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/learning-tracker.git
cd learning-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the `.env.example` to `.env` and update the configuration values as needed.

```bash
cp .env.example .env
```

### 4. Set Up Docker for MinIO and PostgreSQL

Run the following command to spin up the necessary services for MinIO and PostgreSQL using Docker Compose:

```bash
docker-compose -f docker-compose-local.yml up -d
```

### 5. Run Migrations

Run the migrations to set up the PostgreSQL database schema:

```bash
node ace migration:run
```

### 6. Start the AdonisJS Server

Now you can start the AdonisJS server:

```bash
node ace serve --watch
```

Your server should now be running at `http://localhost:3333`.

## Usage

- **Upload Course Videos**: Users can upload course videos, which are stored in MinIO.
- **Track Progress**: Users can view and track the progress of the uploaded courses.

## API Documentation

The project includes comprehensive API documentation to help developers understand and use the API. You can find the documentation in the `api-doc` folder of the repository. This section contains details about all the available endpoints, including:

- Authentication
- Course video management
- Progress tracking

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

---
