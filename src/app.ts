import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { getAppDataSource } from './data-source';
import { blogRelativeRoute, blogRouter, userRouter } from './routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

/**
 * Sets the http-request options for an express server.
 * @param app The express application to set its express server's request options.
 */
function setRequestOptions(app: any) {
  /**
   * Allow parse incoming requests as JSON payloads.
   */
  app.use(express.json({ limit: '5mb' }));

  /**
   * Allow parse incoming urlencoded requests bodies.
   */
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
}

function registerRoutes(app: any) {
  /**
   * Initialize swagger-jsdoc.
   * Swagger UI route.
   */
  const swaggerDocument = YAML.load(path.resolve(__dirname, './docs/collection.yml'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  /**
   * The base-route prefix for the api.
   * e.g. `/api/organizations`, `/api/products`.
   */
  const apiBaseRoute = '/api/';
  app.use(apiBaseRoute, userRouter);
  app.use(apiBaseRoute + blogRelativeRoute, blogRouter);
}

function setupServer(app: any) {
  /**
   * The order matters.
   * 2. Set request options.
   * 3. Register routes.
   */

  setRequestOptions(app);
  registerRoutes(app);
}

/**
 * Initial database connection.
 * Starts an express server.
 */
async function startServer() {
  await getAppDataSource().initialize();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

setupServer(app);
startServer();
