import express from 'express';

import userRouter           from './user';
import carActivityRouter    from './carActivity';
import userCategoryRouter   from './userCategory';
import authRouter           from './auth';
import accountRouter        from './account';
import permissionRouter     from './permission'
import monthlyBudgetRouter  from './monthlyBudget';

const router = express.Router();

router.use('/users',            userRouter);
router.use('/car_activities',   carActivityRouter);
router.use('/user_categories',  userCategoryRouter);
router.use('/auth',             authRouter);
router.use('/account',          accountRouter);
router.use('/permissions',      permissionRouter);
router.use('/monthly_budgets',  monthlyBudgetRouter);

export default router;