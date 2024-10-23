Technical assessment overview
----------------------------------

-Backend (Express + MongoDB)

- Set up Express server and connected to MongoDB with Mongoose.

- Implemented user registration with password hashing (bcrypt) and user login with JWT token generation (access & refresh tokens).

- Stored tokens in HTTP-only cookies for security.

- Added middleware to protect routes by verifying JWT access tokens.

- Implemented token refresh mechanism to issue new access tokens using refresh tokens.

- Created a logout function to clear cookies and invalidate tokens.

-Frontend (Next.js)

- Set up Next.js frontend.

- Integrated Axios for API requests and handled tokens with credentials in cookies.

- Used Axios interceptors to refresh access tokens when expired.

- Implemented a higher-order component (HOC) to check user authentication and protect client-side routes.

- Managed user authentication state and redirected unauthenticated users to login.

-Deployment

-Deployed a web service instance to render where Next.js is served from express, to ensure cookies can be transmitted.
