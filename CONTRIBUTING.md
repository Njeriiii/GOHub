## Running Development and Production Environments

### Prerequisites

Before you start, ensure you have the following installed on your machine:

- **Docker**: Docker and Docker Compose must be installed and running. You can find the installation instructions [here](https://docs.docker.com/get-docker/).
- **Git**: To clone the repository, ensure you have Git installed.

### Clone the Repository

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Njeriiii/GOHub.git
   cd GOHub
   ```

### Running in Development Mode

To run the application in development mode using Docker Compose, follow these steps:

1. **Start Development Environment**:
   Use the following command to build and start both the backend and frontend services defined in the `docker-compose.dev.yml` file:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the Application**:
   - **Frontend**: Open your browser and navigate to `http://localhost:3000`.
   - **Backend**: The backend API will be accessible at `http://localhost:5162`.

3. **Hot Reloading**:
   Changes made to the frontend or backend code will automatically reflect without needing to restart the containers.

4. **Teardown**:
```bash
   docker-compose -f docker-compose.dev.yml up down
   ```

### Running in Production Mode

For production deployment, we will use Docker to create optimized images for the backend and frontend services. Follow these steps:

1. **Build Production Images**:
   From the root of your project directory, run the following command to build the production images using the `docker-compose.prod.yml` file:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start Production Environment**:
   After building the images, start the production environment with this command:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Access the Application**:
   - **Frontend**: Access the frontend at [https://gohub-frontend.onrender.com](https://gohub-frontend.onrender.com).
   - **Backend**: The backend API will be accessible at [https://gohub.onrender.com](https://gohub.onrender.com).

4. **Teardown**:
```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Notes

- **Environment Variables**: Ensure that the necessary environment variables are set for both development and production environments. These can be specified in a `.env` file or directly in the Docker Compose files.
- **Debugging**: In development mode, you can set the `FLASK_ENV` environment variable to `development` to enable debug mode for the Flask app.

### Docker Compose Files

- **`docker-compose.dev.yml`**: Used for development with hot reloading and live updates.
- **`docker-compose.prod.yml`**: Used for building and deploying the application in a production-ready environment.
