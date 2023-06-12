# LoA Viewer

This project displays all conditions from a Letter of Agreement in a table.
It is intended to improve the searchability of letter of agreements by allowing to search conditions from all letters at the same time.

## Contact

|        Name         | Responsible for |    Contact    |
| :-----------------: | :-------------: | :-----------: |
| Moritz F. - 1234027 |       \*        | nav@vatger.de |
|  Leon K. - 1424877  |  Map component  | nav@vatger.de |

## Prerequisites

-   **Node.js** (https://nodejs.org/en)
-   **Docker** (https://www.docker.com)
-   **MongoDB** (https://www.mongodb.com/docs/manual/reference/program/mongod/)

## Running the Application

### Frontend

To start the frontend, follow these steps:

1. Open a terminal or command prompt and navigate to the project directory.
2. Navigate to the frontend folder using the cd command.
3. Install the necessary dependencies by running npm install.
4. Once the dependencies are installed, start the development server by running npm start.
5. The frontend should now be accessible at `http://localhost:3000/` in your web browser.

### Backend

To start the backend, follow these steps:

1. Ensure that you have Docker and Docker Compose installed on your system.
2. Open a terminal or command prompt and navigate to the project directory.
3. Make sure you are in the root directory of the project.
4. Run the following command to start the backend using Docker Compose: `docker-compose up`

Docker Compose will build and start the containers defined in the docker-compose.yml file.
The backend services should now be up and running.
Note: Please make sure to set up any necessary environment variables or configuration files before starting the backend with Docker Compose.

Once both the frontend and backend are successfully started, you should be able to access the application at `http://localhost:3000/` and interact with its features.
