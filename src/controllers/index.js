import express from 'express';

import userRouter from './user';
import carActivityRouter from './carActivity';
import userCategoryRouter from './userCategory';
import authRouter from './auth';

const router = express.Router();

router.use('/users', userRouter);
router.use('/car_activities', carActivityRouter);
router.use('/user_categories', userCategoryRouter);
router.use('/auth', authRouter)

export default router;