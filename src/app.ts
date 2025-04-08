import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const PORT = process.env.PORT|| 3000;
const app = express();

/**
 * Sets the http-request options for an express server.
 * @param app The express application to set its express server's request options.
 */
function setRequestOptions(app:any) {

  /**
   * Allow parse incoming requests as JSON payloads.
   */
  app.use(express.json({ limit: '5mb' }));

  /**
   * Allow parse incoming urlencoded requests bodies.
   */
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
}

function registerRoutes(app:any) {
  /**
   * The base-route prefix for the api.
   *
   * e.g. `/api/organizations`, `/api/products`.
   */
  const apiBaseRoute = '/api/';

}

function setupServer(app:any) {
  /**
   * The order matters.
   * 2. Set request options.
   * 3. Register routes.
   */

  setRequestOptions(app);
  registerRoutes(app);
}

/**
 * Starts an express server.
 */
async function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

setupServer(app);
startServer();
