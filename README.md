
---
**Backend Assignment for QUICKLEAP INNOVATIONS PRIVATE LIMITED**

# Subscription Management Service (Node.js)

Welcome to the Subscription Management Service! This is a robust backend microservice, built with Node.js and Express.js, designed to handle all aspects of user subscriptions for a SaaS platform. Think of it as the brain behind managing plans, signing users up, and overseeing their subscription lifecycle.

## What It Does (Key Features)

This service provides a clear, RESTful API for:

*   **Subscription Plans:**
    *   Listing all available subscription plans (e.g., Basic, Pro, Premium). Each plan includes its `name`, `price`, available `features`, and `duration`.
*   **User Subscriptions:**
    *   **Create a New Subscription:** Users can subscribe to a plan. (Heads up: A user can only have one *active* subscription at a time).
    *   **Retrieve Current Subscription:** Get detailed information about a user's latest subscription.
    *   **Update a Subscription:** Allows users to change their plan (e.g., upgrade or downgrade). For simplicity, our current implementation cancels the existing active subscription and immediately starts a new one.
    *   **Cancel a Subscription:** Marks a user's current active subscription as `CANCELLED`. The user retains access until the original `endDate`, after which the subscription will automatically become `EXPIRED`.
*   **Subscription Status Management:**
    *   Supports various statuses: `ACTIVE`, `INACTIVE` (reserved for future use like payment failures), `CANCELLED`, and `EXPIRED`.
    *   Subscriptions are automatically set to `EXPIRED` once their defined duration has passed. This check happens efficiently when a subscription is retrieved or updated.

## How It's Built (Architecture & Design)

We've structured this microservice using a **layered architecture**, drawing inspiration from MVC/Clean Architecture principles. This ensures modularity, readability, and maintainable code:

*   **`src/config/`**: Manages environment variables and sets up the database connection.
*   **`src/models/`**: Defines our data schemas (`Plan` and `Subscription`) using Mongoose for MongoDB, including helpful hooks for automated data population (like `endDate`).
*   **`src/utils/`**: Contains general utility helpers, such as our custom `AppError` class for consistent error responses and `durationParser` for calculating subscription end dates.
*   **`src/middleware/`**: Houses Express middleware. Here you'll find our JWT authentication, input validation using `express-validator`, and a centralized error handler to gracefully manage all application errors.
*   **`src/services/`**: This is the core business logic layer. Controllers delegate tasks here, keeping business rules neatly separated from HTTP concerns. Services interact directly with the models.
*   **`src/controllers/`**: Handle incoming HTTP requests, orchestrate calls to the service layer, and prepare structured HTTP responses.
*   **`src/routes/`**: Defines all the API endpoints and maps them to the appropriate controller methods, applying necessary middleware (authentication, validation).
*   **`src/app.js`**: Our main Express application setup. It applies global middleware, mounts the API routes, and includes the essential catch-all error handling.
*   **`src/server.js`**: The application's entry point. It's responsible for connecting to MongoDB and starting the Express server.

This thoughtful design promotes:

*   **Scalability:** The microservice is self-contained and stateless (thanks to JWTs), making it easy to scale horizontally.
*   **Fault Tolerance:** Robust error handling and process management help prevent unexpected crashes.
*   **Performance:** Leveraging Node.js's non-blocking I/O, it's efficient for API services.
*   **Security:** Strong JWT authentication, strict input validation, and secure environment variable handling are in place.
*   **Code Quality:** Clear separation of concerns makes the codebase easy to understand, test, and extend.

## Tech Stack At A Glance

*   **Backend Framework:** Node.js with Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Environment Variables:** `dotenv`
*   **Input Validation:** `express-validator`
*   **Request Logging:** `morgan` (super helpful for development!)
*   **Development Tooling:** `nodemon` (auto-restarts your server)

## Getting Started (Setup Instructions)

Let's get this service up and running on your local machine!

### Prerequisites

*   **Node.js:** Ensure you have Node.js (v14 or newer) and npm (Node Package Manager) installed.
*   **MongoDB:** You'll need a running MongoDB instance, either locally or accessible via a cloud service (e.g., MongoDB Atlas).

### 1. Clone the Repository

If you're cloning this project from a Git repository:

```bash
git clone https://github.com/Vishwa1011-AFK/QuickLeap_Microservice
cd QuickLeap_subscription-service
```

### 2. Install Dependencies

Navigate into your project directory and install all required Node.js packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a file named `.env` in the **root** directory of your project. This file stores sensitive configuration details. Copy the content from the `.env.example` file (you should have one from project setup) and fill it in:

**`.env` (Example Content):**
```dotenv
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/subscription_db
JWT_SECRET=Security_KEY
JWT_EXPIRES_IN=1h
```

*   `MONGO_URI`: Your MongoDB connection string. For local testing, `mongodb://localhost:27017/subscription_db` is a common default.
*   `JWT_SECRET`: **Crucial for security!** This should be a long, complex, and random string. It's used to sign and verify JWT tokens. **Never expose this in public repositories!**
*   `JWT_EXPIRES_IN`: Defines the default expiration time for generated JWTs (e.g., `1h` for 1 hour, `7d` for 7 days).

### 5. Start the Server

Once everything is set up, you can fire up the application:

*   **For Development (with auto-restarts on code changes):**
    ```bash
    npm run dev
    ```
*   **For Production (a more stable run):**
    ```bash
    npm start
    ```

You should see confirmation in your terminal that MongoDB is connected and the server is listening on the configured port (e.g., "Server running on port 3000 in development mode.").

## 🎯 API Endpoints (How to Interact)

All API endpoints are prefixed with `/api/v1`.

### Authentication (You'll need a JWT!)

All API endpoints in this service are protected by JWT authentication. You *must* include an `Authorization` header with your requests in the format:

`Authorization: Bearer YOUR_GENERATED_JWT_TOKEN_HERE`

#### How to get a test JWT token:

Since this microservice focuses solely on subscription management and not user authentication itself (that's typically another microservice's job), you'll generate a test token manually. This token contains a `userId` that you'll use for specific subscription operations.


### How to Manually Create a JWT Token Using `jwt.io`

1.  **Go to `jwt.io`:**
    Open your web browser and navigate to `https://jwt.io/`.

2.  **Set the Algorithm:**
    On the left side, under the "Decoded" section, find the "Algorithm" dropdown. Ensure it's set to **`HS256`**. This matches the default algorithm used by our Node.js `jsonwebtoken` library.

3.  **Define the Header:**
    Below the Algorithm, you'll see the "Header" box. It's usually pre-filled correctly. It should look like this:
    ```json
    {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```
    You typically don't need to change this.

4.  **Define the Payload (Crucial Step):**
    Below the "Header", you'll see the "Payload" box. This is where you put the data your token carries. Our `authMiddleware` expects a `user` object with an `id`.

    **Replace the default content in the "Payload" box with this JSON:**
    ```json
    {
      "user": {
        "id": "60c72b2f9c9b8b001c8e4c70"
      },
      "iat": 1678886400,  
      "exp": 1678890000   
    }
    ```
    *   **IMPORTANT:** Replace `"60c72b2f9c9b8b001c8e4c70"` with the exact `TEST_USER_ID` string you are using in your `generateToken.js` file and in your `.env` for consistency. This is the ID you'll use in your API requests like `/subscriptions/{userId}`.
    *   `iat` (issued at) and `exp` (expiration) are standard JWT claims. `jwt.io` will often auto-populate these or update them if you click somewhere else. The specific numbers don't matter much for manual generation, as long as `exp` is in the future.

5.  **Enter Your Secret (Also Crucial):**
    Scroll down to the "Verify Signature" section (bottom right). You'll see a text field labeled "your-secret".

    **Paste your `JWT_SECRET` from your `.env` file into this field.**

    *   **Accuracy is key!** The secret must be *exactly* the same as in your `.env` file. If it's wrong, the signature verification will fail, and your token won't work with your service.

6.  **Copy the Generated Token:**
    After setting the algorithm, payload, and secret, the "Encoded" box (top right) will automatically update. This is your JWT token.

    **Copy the entire string from the "Encoded" box.**



### How to Use This Token in Your Requests:

Whenever you make a request to a protected endpoint (like `GET /api/v1/plans` or `POST /api/v1/subscriptions`), you will include this token in the `Authorization` header:

```
Authorization: Bearer <PASTE_YOUR_COPIED_JWT_TOKEN_HERE>
```

This manually generated token acts just like a token issued by a real authentication service, allowing you to test your subscription microservice.


---

### 1. Plan Management Endpoints

#### `GET /api/v1/plans`

*   **Description:** Retrieves a list of all available subscription plans defined in the system.
*   **Authentication:** Required.
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "results": 4,
        "data": {
            "plans": [
                {
                    "name": "Basic",
                    "price": 9.99,
                    "features": ["Access to basic content", "Email support (24/7)", "SD streaming"],
                    "duration": "1 month",
                    "id": "60c72b2f9c9b8b001c8e4c71" 
                },
                {
                    "name": "Pro",
                    "price": 19.99,
                    "features": ["Access to premium content", "Priority email support", "HD streaming", "Unlimited devices"],
                    "duration": "1 month",
                    "id": "60c72b2f9c9b8b001c8e4c72"
                }
                // ... other plans you've seeded
            ]
        }
    }
    ```

---

### 2. User Subscription Management Endpoints

#### `POST /api/v1/subscriptions`

*   **Description:** Creates a new subscription for the user authenticated by the JWT. A user can only have one `ACTIVE` subscription at a time.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
        "planId": "PASTE_A_PLAN_ID_FROM_THE_GET_PLANS_RESPONSE_HERE"
    }
    ```
*   **Example Response (201 Created):**
    ```json
    {
        "status": "success",
        "message": "Subscription created successfully.",
        "data": {
            "subscription": {
                "userId": "YOUR_AUTH_USER_ID_FROM_TOKEN",
                "plan": "PLAN_ID_USED_FOR_SUBSCRIPTION",
                "startDate": "2024-05-20T10:00:00.000Z",
                "endDate": "2024-06-20T10:00:00.000Z",
                "status": "ACTIVE",
                "priceAtSubscription": 9.99,
                "id": "NEWLY_CREATED_SUBSCRIPTION_ID"
            }
        }
    }
    ```
*   **Possible Errors:** `400 Bad Request` (e.g., `planId` is invalid, user already has an active subscription), `401 Unauthorized`.

#### `GET /api/v1/subscriptions/{userId}`

*   **Description:** Retrieves the details of a user's current subscription. The `userId` in the URL path **must match** the `userId` embedded in your JWT token for proper authorization.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `userId` (string): The ID of the user whose subscription you want to retrieve (e.g., `60c72b2f9c9b8b001c8e4c70`).
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "data": {
            "subscription": {
                "userId": "YOUR_AUTH_USER_ID_FROM_TOKEN",
                "plan": { /* The full plan object details */ },
                "startDate": "2024-05-20T10:00:00.000Z",
                "endDate": "2024-06-20T10:00:00.000Z",
                "status": "ACTIVE",
                "priceAtSubscription": 19.99,
                "id": "EXISTING_SUBSCRIPTION_ID"
            }
        }
    }
    ```
*   **Possible Errors:** `403 Forbidden` (if `userId` in URL does not match JWT), `404 Not Found` (no subscription found for this user), `401 Unauthorized`.

#### `PUT /api/v1/subscriptions/{userId}`

*   **Description:** Allows a user to upgrade or downgrade their subscription plan. This action cancels the existing active subscription and immediately creates a new one with the specified plan. The `userId` in the URL path **must match** the `userId` from your JWT token.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `userId` (string): The ID of the user whose subscription you want to update.
*   **Request Body:**
    ```json
    {
        "newPlanId": "ID_OF_THE_NEW_PLAN_TO_SWITCH_TO"
    }
    ```
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "message": "Subscription updated successfully.",
        "data": {
            "subscription": {
                "userId": "YOUR_AUTH_USER_ID",
                "plan": "NEW_PLAN_ID",
                "startDate": "...",
                "endDate": "...",
                "status": "ACTIVE",
                "priceAtSubscription": "NEW_PLAN_PRICE",
                "id": "NEW_SUBSCRIPTION_ID"
            }
        }
    }
    ```
*   **Possible Errors:** `403 Forbidden`, `404 Not Found` (no active subscription found for update, or `newPlanId` is invalid), `400 Bad Request` (e.g., attempting to switch to the same plan).

#### `DELETE /api/v1/subscriptions/{userId}`

*   **Description:** Allows a user to cancel their subscription. The current active subscription's status will be changed to `CANCELLED`. It will remain active until its original `endDate`, after which it transitions to `EXPIRED`. The `userId` in the URL path **must match** the `userId` from your JWT token.
*   **Authentication:** Required.
*   **Path Parameters:**
    *   `userId` (string): The ID of the user whose subscription you want to cancel.
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "message": "Subscription cancelled successfully.",
        "data": {
            "subscription": {
                "id": "CANCELLED_SUBSCRIPTION_ID",
                "userId": "YOUR_AUTH_USER_ID",
                "status": "CANCELLED"
                // ... other subscription details
            }
        }
    }
    ```
  **Possible Errors:** `403 Forbidden`, `404 Not Found` (no active subscription found to cancel).
