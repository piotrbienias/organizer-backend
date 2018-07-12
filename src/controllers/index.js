import express from 'express';

import userRouter           from './user';
import carActivityRouter    from './carActivity';
import userCategoryRouter   from './userCategory';
import authRouter           from './auth';
import accountRouter        from './account';
import permissionRouter     from './permission'
import monthlyBudgetRouter  from './monthlyBudget';
import expenseRouter        from './expense';
import eventRouter          from './event';
import reminderRouter       from './reminder';



export default (io) => {

    const router = express.Router();

    router.use('/users',            userRouter(io));
    router.use('/car_activities',   carActivityRouter);
    router.use('/user_categories',  userCategoryRouter);
    router.use('/auth',             authRouter);
    router.use('/account',          accountRouter);
    router.use('/permissions',      permissionRouter);
    router.use('/monthly_budgets',  monthlyBudgetRouter(io));
    router.use('/expenses',         expenseRouter);
    router.use('/events',           eventRouter(io));
    router.use('/reminders',         reminderRouter(io));

    return router;

};