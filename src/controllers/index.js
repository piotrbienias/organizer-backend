import express from 'express';

import userRouter           from './user';
import carActivityRouter    from './carActivity';
import userCategoryRouter   from './userCategory';
import authRouter           from './auth';
import accountRouter        from './account';
import permissionRouter     from './permission'
import monthlyBudgetRouter  from './monthlyBudget';
import expenseRouter        from './expense';





export default (socket) => {

    const router = express.Router();

    router.use('/users',            userRouter(socket));
    router.use('/car_activities',   carActivityRouter);
    router.use('/user_categories',  userCategoryRouter);
    router.use('/auth',             authRouter);
    router.use('/account',          accountRouter);
    router.use('/permissions',      permissionRouter);
    router.use('/monthly_budgets',  monthlyBudgetRouter);
    router.use('/expenses',         expenseRouter);

    return router;

};