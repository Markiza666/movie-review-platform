# Movie Review Platform API

A RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. This platform allows users to browse movies, while authenticated users can leave reviews. Administrators have full control over the movie database.

## 🚀 Features

-   **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
-   **Role-Based Access Control**:
    -   **Public**: View movies and their ratings.
    -   **Users**: Post, update, and delete their own reviews.
    -   **Admins**: Full CRUD operations on movies.
-   **Smart Ownership**: Users and Admins can only update or delete content they created.
-   **Data Integrity**: Automatic cascading delete (removing a movie deletes all its reviews).
-   **Advanced Aggregation**: Real-time calculation of average movie ratings.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB (via Mongoose)
-   **Security**: JWT, bcryptjs
-   **Environment**: Dotenv, Tsx, Nodemon

## 📋 Prerequisites

-   [Node.js](https://nodejs.org/) installed
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally

## 🔧 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd movie-review-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:2017/movie-db
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:5000`.

## 🛣️ API Endpoints

### Movies
-   `GET /api/movies` - Get all movies
-   `GET /api/movies/ratings` - Get movies with average ratings
-   `POST /api/movies` - Create a movie (Admin only)
-   `PUT /api/movies/:id` - Update a movie (Owner only)
-   `DELETE /api/movies/:id` - Delete a movie & its reviews (Owner only)

### Reviews
-   `GET /api/reviews` - Get all reviews
-   `POST /api/reviews` - Post a review (Authenticated users)
-   `PUT /api/reviews/:id` - Update a review (Owner only)
-   `DELETE /api/reviews/:id` - Delete a review (Owner only)

### Users
-   `POST /api/users/register` - Register a new user
-   `POST /api/users/login` - Login and get token

## 🛡️ Security Features
-   **Password Hashing**: All passwords are encrypted using bcrypt.
-   **Protected Routes**: Sensitive endpoints require a valid Bearer Token.
-   **Logic Precedence**: Routes are structured to prevent ID collision (e.g., `/ratings` is prioritized over `/:id`).
