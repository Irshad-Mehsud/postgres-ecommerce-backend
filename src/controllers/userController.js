import { ApiError } from '../utills/ApiError.js';
import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';
import uploadFile from '../services/uploadService.js';

const getUploadedImageFile = (req) => {
    return req.file || req.files?.profileImage?.[0] || req.files?.image?.[0] || null;
};

const buildUserPayload = async (req) => {
    const userData = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [
            key.trim(),
            typeof value === 'string' ? value.trim() : value,
        ])
    );
    const uploadedFile = getUploadedImageFile(req);

    if (uploadedFile?.buffer) {
        const profileImage = await uploadFile(uploadedFile.buffer, uploadedFile.mimetype);
        userData.profileImage = profileImage;
    }

    return userData;
};



const CreateUserController = async (req, res, next) => {
    try{
        const userData = await buildUserPayload(req);
        const user = await userService.createUser(userData);
        if (!process.env.JWT_SECRET) throw new ApiError(500, 'JWT secret is not configured');

      // generate JWT token for the user
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h'
      })

        res.status(201).json({ 
            success: true,
            data:{
                user,
                token
            }
        
            });


    }catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to create user', error.message));
    };
}

const GetAllUsersController = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to retrieve users', error.message));
    }
}

const GetUserByIdController = async (req, res, next) => {
    try {

        const userId = req.params.id;
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return next(new ApiError(403, 'Forbidden'));
        }
        const user = await userService.getUserById(userId);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json({ success: true, data: user });


    }catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to retrieve user', error.message));
    }

}

const UpdateUserController = async (req, res, next) => {
    try{

        const userId = req.params.id;
        const userData = await buildUserPayload(req);
        const updatedUser = await userService.updateUserById(userId, userData, req.user.role);
        if (!updatedUser) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json({ success: true, data: updatedUser, message: 'User updated successfully' });

    }catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to update user', error.message));
    }   
}

const deleteUserController = async (req, res, next) => {
    try{
    const userId = req.params.id;
    const deletedUser = await userService.deleteUserById(userId);
    if (!deletedUser) {
        return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({ success: true, data: deletedUser, message: 'User deleted successfully' });

    }catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to delete user', error.message));
    };

}

const LoginUserController = async (req, res, next) => {
    try {
        const user = await userService.loginUser(req.body);
        if (!process.env.JWT_SECRET) throw new ApiError(500, 'JWT secret is not configured');
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ success: true, data: { user, token } });
    } catch (error) {
        next(error instanceof ApiError ? error : new ApiError(500, 'Failed to login', error.message));
    }
};

export {
    CreateUserController,
    GetAllUsersController,
    GetUserByIdController,
    UpdateUserController,
    deleteUserController,
    LoginUserController,
};
