import { successResponse,errorResponse } from '../Utils/responseWrapper.js';
import message from '../Utils/message.js';
import statuscode from '../Utils/statuscode.js';
import { registerAdminService,loginAdminService,createUserAdminService,getUsersByAdminService,deleteUserByAdminService } from '../services/adminServices.js';

export const registerAdmin = async (req, res) => {

  const { userName, email, mobileNo, password } = req.body;

  if (!userName || !email || !mobileNo || !password) {
    return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
  }



  try {
    const result = await registerAdminService({ userName, email, mobileNo, password });
    
    if (result.success) {
      return successResponse(res, statuscode.CREATED, message.ADMIN_CREATED, { 
         token: result.token,
        admin: result.admin, });
    } else {
      return errorResponse(res, statuscode.CONFLICT, message.ALREADY_REGISTERED_ADMIN);
    }
  } catch (error) {
    console.error('Register Admin Error:', error);
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message || 'Internal Server Error');
  }
};


export const loginAdmin = async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
  }

  try {
    const result = await loginAdminService({ email, password });

    if (result.success) {
      return successResponse(res, statuscode.OK, message.LOGIN, {
        token: result.token,
        admin: result.admin,
      });
    } else {
      return errorResponse(res, statuscode.UNAUTHORIZED, message.INVALID_LOGIN);
    }
  } catch (error) {
    console.error('Login Admin Error:', error);
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message || 'Internal Server Error');
  }
  
};


export const crateUserAdmin = async (req, res) => {

  const { userName, email, mobileNo } = req.body;
  const tokenAdminId = req.adminId;
  const paramAdminId = req.params.admin_id;


  if (tokenAdminId !== paramAdminId) {
    return errorResponse(res, statuscode.UNAUTHORIZED, "Unauthorized access");
  }

  if (!userName || !email || !mobileNo) {
    return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
  }

  try {
    const result = await createUserAdminService({
      adminId: paramAdminId, 
      userName,
      email,
      mobileNo,
    });

    if (result.success) {
      return successResponse(res, statuscode.CREATED, message.USER_CREATED, { user: result.user });
    } else {
      return errorResponse(res, statuscode.CONFLICT, message.ALREADY_REGISTERED);
    }
  } catch (error) {
    console.error('Create User Admin Error:', error);
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message || 'Internal Server Error');
  }

};



export const getUsersByAdmin = async (req, res) => {



  const tokenAdminId = req.adminId;
  const paramAdminId = req.params.admin_id;

  if (tokenAdminId !== paramAdminId) {
    return errorResponse(res, statuscode.UNAUTHORIZED, "Unauthorized access");
  }

  try {
    const result = await getUsersByAdminService(paramAdminId);
    return successResponse(res, statuscode.OK, 'Users fetched successfully', { users: result.users });
  } catch (error) {
    console.error('Get Users Error:', error);
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message || 'Internal Server Error');
  }
};


export const deleteUserByAdmin =async (req,res)=>{

  const tokenAdminId = req.adminId;
  const paramAdminId = req.params.admin_id;
  const userId = req.params.userId;
  

  
  if (tokenAdminId !== paramAdminId) {
    return errorResponse(res, statuscode.UNAUTHORIZED, "Unauthorized access");
  }   

  if (!userId) {
    return errorResponse(res, statuscode.BAD_REQUEST, message.MISSING_FIELDS);
  }   

  try {
    const result = await deleteUserByAdminService(paramAdminId, userId);
    if (result.success) {
      return successResponse(res, statuscode.OK, message.USER_DELETED);
    } else {
      return errorResponse(res, statuscode.NOT_FOUND, message.NOT_FOUND);
    }
  } catch (error) {
    console.error('Delete User Error:', error);
    return errorResponse(res, statuscode.INTERNAL_ERROR, error.message || 'Internal Server Error');
  }
    
}