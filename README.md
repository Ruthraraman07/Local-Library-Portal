# Local Library Portal - Backend setup

This is the backend component of the Local Library Portal application. It provides the API endpoints for managing books, users, and authentication.

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Installation](#installation)
3.  [Configuration](#configuration)
4.  [Database Setup](#database-setup)
5.  [Running the Server](#running-the-server)
6.  [API Endpoints](#api-endpoints)
7.  [File Uploads (if applicable)](#file-uploads-if-applicable)
8.  [Socket.IO Integration](#socketio-integration)
9.  [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:**  Version 16 or higher is recommended. Download from [https://nodejs.org/](https://nodejs.org/)
*   **npm (Node Package Manager):**  Usually comes with Node.js.  Verify with `npm -v` in your terminal.
*   **MongoDB:**  Install MongoDB Community Edition. Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).  Make sure the MongoDB server is running.
*   **(Optional) MongoDB Compass:** A GUI for managing your MongoDB database. Download from [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
*   **(Optional) Git:** For version control. Download from [https://git-scm.com/](https://git-scm.com/)

## 2. Installation

1.  **Clone the repository (if applicable):**

    ```bash
    git clone <your_repository_url>
    cd <your_backend_directory>  # e.g., cd Backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    This command will install all the necessary packages listed in the `package.json` file.

## 3. Configuration

1.  **Create a `.env` file:**

    Create a file named `.env` in the root directory of your backend project. This file will store your environment-specific configuration variables.  See the [Environment Variables](#environment-variables) section for the required variables.

2.  **Configure CORS (if applicable):**

    If your frontend is running on a different domain or port than your backend, you'll need to configure CORS (Cross-Origin Resource Sharing) to allow requests from the frontend.  This is typically done in your `server.js` file using the `cors` middleware.  The example below allows requests from `http://localhost:3000`:

    ```javascript
    // server.js
    const cors = require('cors');
    app.use(cors({ origin: ["http://localhost:3000"] }));
    ```

## 4. Database Setup

1.  **Start the MongoDB server:**

    Make sure your MongoDB server is running. The default port is usually `27017`.  The exact command to start the server depends on your operating system and installation method.  Common commands include:

    *   **Windows:** `net start MongoDB` (in an administrator command prompt)
    *   **macOS (Homebrew):** `brew services start mongodb-community`
    *   **Linux (systemd):** `sudo systemctl start mongod`

2.  **Configure the MongoDB URI:**

    Set the `MONGO_URI` environment variable in your `.env` file to the connection string for your MongoDB database.  A typical connection string looks like this:

    ```
    MONGO_URI=mongodb://localhost:27017/<your_database_name>
    ```

    Replace `<your_database_name>` with the name of the database you want to use.  If the database doesn't exist, MongoDB will create it automatically.

## 5. Running the Server

1.  **Start the backend server:**

    ```bash
    npm start
    ```

    This command will execute the `start` script defined in your `package.json` file, which typically runs your `server.js` file using Node.js.

2.  **Verify the server is running:**

    You should see a message in your console indicating that the server is running and connected to the database.  For example:

    ```
    DB connected successfully
    Server running on port 4000
    ```

## 6. API Endpoints

The backend provides the following API endpoints:

*   `/api/books`:  Manage books (create, read, update, delete, filter).
*   `/api/auth`:  Authentication (register, login).
*   `/api/users`:  Manage users (if applicable).

See the API documentation (if available) or the route definitions in your `routes` directory for more details on the available endpoints and their parameters.

## 7. File Uploads (if applicable)

If your application supports file uploads (e.g., for book images), you'll need to configure the server to handle them.  The example below uses `multer` to store uploaded files in the `uploads` directory:

1.  **Install `multer`:**

    ```bash
    npm install multer
    ```

2.  **Configure `multer` in your controller:**

    ```javascript
    // controllers/BookController.js
    const multer = require('multer');
    const path = require('path');

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/book_images');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
      }
    });

    const upload = multer({ storage: storage });

    // Use the upload middleware in your route handler
    exports.createBook = [
      upload.single('image'), // 'image' is the name of the file input
      async (req, res) => {
        // ... your createBook logic here
        // Access the uploaded file via req.file
      }
    ];
    ```

3.  **Serve static files:**

    Configure your Express server to serve static files from the `uploads` directory:

    ```javascript
    // server.js
    const express = require('express');
    const path = require('path');

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    ```

## 8. Socket.IO Integration

If your application uses Socket.IO for real-time updates, ensure the following:

1.  **Install Socket.IO:**

    ```bash
    npm install socket.io
    ```

2.  **Configure Socket.IO in `server.js`:**

    ```javascript
    // server.js
    const http = require('http');
    const { Server } = require("socket.io");

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["POST", "GET"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    server.listen(process.env.PORT, () => {
      console.log('Server listening on port', process.env.PORT);
    });
    ```

3.  **Emit and listen for events:**

    In your backend code, use `io.emit()` to send events to connected clients. In your frontend code, use `socket.on()` to listen for these events.

## 9. Environment Variables

The following environment variables are required:

*   `PORT`: The port the server will listen on (e.g., `4000`).
*   `MONGO_URI`: The connection string for your MongoDB database (e.g., `mongodb://localhost:27017/library`).
*   `JWT_SECRET`: A secret key used for signing JSON Web Tokens (JWTs) for authentication.  Generate a strong, random string.
*   `CLOUDINARY_CLOUD_NAME` (if using Cloudinary): Your Cloudinary cloud name.
*   `CLOUDINARY_API_KEY` (if using Cloudinary): Your Cloudinary API key.
*   `CLOUDINARY_API_SECRET` (if using Cloudinary): Your Cloudinary API secret.

Example `.env` file:


**Important:**  Never commit your `.env` file to version control.  Add it to your `.gitignore` file to prevent it from being accidentally committed.

## 10. Troubleshooting

*   **"Cannot find module" errors:**  Make sure you have installed all the necessary dependencies using `npm install`.  Double-check the module name for typos.
*   **Database connection errors:**  Verify that your MongoDB server is running and that the `MONGO_URI` environment variable is correctly configured.
*   **CORS errors:**  Make sure your CORS configuration in `server.js` allows requests from your frontend's origin.
*   **Port already in use:**  If you get an error that the port is already in use, try changing the `PORT` environment variable to a different port.
*   **File upload errors:**  Check the file size limits and file type restrictions in your `multer` configuration.  Make sure the `uploads` directory exists and the server has write permissions to it.

## 11. Contributing

If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise commit messages.
4.  Submit a pull request to the main branch.

## 12. License

[Specify the license for your project here.  For example, MIT License.]


### Frontend Setup
![Screenshot 2025-06-11 120524](https://github.com/user-attachments/assets/a4eda84f-0a72-4be8-9c20-3f59babfafed)
![Screenshot 2025-06-11 120744](https://github.com/user-attachments/assets/83c9d6cb-08be-42b7-ab9a-71f98e0d4f4e)
![Screenshot 2025-06-11 120806](https://github.com/user-attachments/assets/93fd8c9b-b3d9-4615-8685-c64f29d9da3e)
![Screenshot 2025-06-11 120911](https://github.com/user-attachments/assets/a9eb8c9f-5fcf-42fb-ae54-b0fdbdd13a43)
![Screenshot 2025-06-11 120924](https://github.com/user-attachments/assets/890336ed-44da-4e30-82b7-86fddb65a914)
![Screenshot 2025-06-11 120949](https://github.com/user-attachments/assets/0d9b137b-c325-444d-8da3-1b72846bf927)
![Screenshot 2025-06-11 121004](https://github.com/user-attachments/assets/228ed190-05a6-45ee-b885-4225e7671f94)
![Screenshot 2025-06-11 124853](https://github.com/user-attachments/assets/adafaa9d-79eb-4000-ad12-b6dcd61daad0)
![Screenshot 2025-06-11 125022](https://github.com/user-attachments/assets/54d24b35-996d-455d-aabc-fb80d51199b2)




1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```

## Usage
- Access the frontend at `http://localhost:3000`.
- The frontend communicates with the backend API for data operations.

## License
This project is licensed under the MIT License.
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 1cc1d17 (Initialize project using Create React App)
