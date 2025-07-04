import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { registerAdmin,loginAdmin,crateUserAdmin,getUsersByAdmin,deleteUserByAdmin } from '../controllers/AdminController.js';

const AdminRouter = express.Router();

AdminRouter.post('/register',registerAdmin);
AdminRouter.post('/login',loginAdmin);
AdminRouter.post('/:admin_id/create-user',authMiddleware,crateUserAdmin);
AdminRouter.get('/:admin_id/getAllUsers', authMiddleware, getUsersByAdmin);
AdminRouter.delete('/:admin_id/deleteUser/:userId', authMiddleware, deleteUserByAdmin);


export default AdminRouter;
