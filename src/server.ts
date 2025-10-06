/**
 * Node_modules
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */

import config from './config';
import limiter from './lib/express_rate_limit';
import { logger } from './lib/winston';
/**
 * Types
 */

import { CorsOptions } from 'cors';

/**
 * Routes
 */
import templateRoutes from './routes/templateRouter';

/**
 * Middlewares
 */

const app = express();

//cors option
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGIN.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.error(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

//CORS
app.use(cors(corsOptions));

//BODY PARSER
app.use(express.json());

//built-in body-parsing middleware for handling HTML form submissions.
app.use(express.urlencoded({ extended: true }));

//Cookie parser
app.use(cookieParser());

//Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, //Only compress response larger than 1kb
  }),
);

//Helmet to enhance security by setting various HTTP header
app.use(helmet());

//Rate limiter
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server
 * - Tries to connect to the database before initializing the server
 * - Define the API Route ex: ("/api/v1")
 * - Start the server on specified PORT and logs the running URL.
 * - If an error occurs during the startup, it logged, and the process exits with status 1.
 */
(async () => {
  try {
    /**
     * Routes
     */
    app.use('/', templateRoutes);

    //Start the Server
    app.listen(config.PORT, () => {
      logger.info(
        `Server running at PORT:${config.PORT} (${process.env.NODE_ENV})`,
      );
    });
  } catch (error) {
    logger.error('Failed to start the server.', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

/**
 * Handle server shutdown gracefully by disconnecting from the database.
 * - Attempt to disconnect from the database before shutting down the server
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, will it logged to the console.
 *  Exit the process with status code '0' (indicating a successful shutdown).
 */
const handleServerShutdown = async () => {
  try {
    logger.info('Server shutdown.');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

/**
 * Listens for termination signal ('SIGTERM' and 'SIGINT.').
 *
 * - SIGTERM is typically sent when stopping a process (e.g, 'kill command or container shutdown').
 * - SIGINT is triggered when the user interrupts the process (e.g, pressing the Ctrl + C).
 * - When either signal is recieved, 'handleServerShutdown' is executed to ensure proper cleanup
 */

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
