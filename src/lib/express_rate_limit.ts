import { error } from 'console';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000, // time request per in milliseconds
  limit: 60, // limit each IP
  standardHeaders: 'draft-8', //Use the  latest standard rate-limit headers
  legacyHeaders: false, // disable the deprecated X-RateLimit-* headers
  message: {
    error: 'Too many request! Please try again later.',
  },
});

export default limiter;
