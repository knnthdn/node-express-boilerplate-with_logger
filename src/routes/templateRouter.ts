import { Router } from 'express';

const router = Router();

router.route('/').get((_, res) => {
  res.status(200).json({
    message: 'API is live, you can now start working.',
    status: 'ok',
    version: '1.0.0',
    timeStamp: new Date().toISOString(),
  });
});

export default router;
