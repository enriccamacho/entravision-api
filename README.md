axios: Axios is a promise-based HTTP client for the browser and Node.js. It's widely used for making HTTP requests to external resources or APIs. I chose Axios because of its simplicity, ease of use, and robust features like automatic JSON parsing, request cancellation, and error handling.

cors: CORS (Cross-Origin Resource Sharing) is a mechanism that allows resources on a web page to be requested from another domain outside the domain from which the resource originated. I included the CORS middleware in my project to enable cross-origin requests, which are often necessary when building APIs that are consumed by clients running on different domains.

dotenv: The dotenv library allows loading environment variables from a .env file into process.env. It's essential for managing environment-specific configurations, such as database connection strings, API keys, or other sensitive information. Using dotenv keeps sensitive data out of version control and allows for easy configuration management across different environments.

express: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. I chose Express because of its simplicity, middleware support, and extensive ecosystem of plugins. It simplifies the process of handling HTTP requests, routing, and middleware integration, making it ideal for building RESTful APIs.

mongoose: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward schema-based solution for modeling application data and interacting with MongoDB databases. I chose Mongoose for its ease of use, powerful validation features, middleware support, and integration with TypeScript, which simplifies working with MongoDB in TypeScript projects.

nodemon: Nodemon is a utility that monitors changes in files and automatically restarts the Node.js application when changes are detected. It's commonly used during the development phase to streamline the development workflow and eliminate the need for manual server restarts after code changes. Nodemon improves productivity by reducing development turnaround time and facilitating a smoother development experience.

ts-node: It allows running TypeScript code directly without the need for compilation to JavaScript. I included ts-node in my project to enable running TypeScript files directly, which simplifies the development process and eliminates the need for an explicit build step during development. 
In thos case, where it is an small application/prototype, we will use for simplicity but should be removed in the future due to performance and security issues compared to the normal build step.

bottleneck: It allows you to set rate limiting for our requests to the football data API. I decided to use this library because it can be used both client-side and server-side and can be useful for the future (in a case where we continued with this app's development).