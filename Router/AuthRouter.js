import express from 'express';
import {renderIndex,renderLogin,renderRegister,renderDashboard,renderUserLogin,renderUserForgotPassword,
    renderResetForm,renderUserDashboard} from '../controllers/authController.js';

const router = express.Router();

router.get("/",renderIndex)
router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/dashboard',renderDashboard)
router.get('/user/login',renderUserLogin)
router.get('/user/forgot-password',renderUserForgotPassword )
router.get('/user/reset-password', renderResetForm);
router.get('/user/:adminId/reset-password', renderResetForm);
router.get('/user/dashboard',renderUserDashboard)




export default router;
