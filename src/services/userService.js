import User from '../models/User.js';
import { ApiError } from '../utills/ApiError.js';
import userValidation from '../validations/userValidation.js';
import bcrypt from 'bcrypt';
import { loginValidation } from '../validations/authValidation.js';

const createUser = async (userData) => {

    // Validate user data
    const { error } = userValidation.validate(userData);
    if (error) {
        throw new ApiError(400, 'Validation error', error.details);
    }

    const {name, email, password, phone, role, profileImage} = userData;
    //check if user already exists
    const existingUser = await User.findUnique({ where: { email } });
    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    // hash password before saving to database

    const hashedPassword = await bcrypt.hash(password, 10);


    // Create new user
    const newUser = await User.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'customer',
            profileImage
        }
    });

    const { password: _password, ...userResponse } = newUser;
    return userResponse;
};


const getAllUsers = async () => {
    const users = await User.findMany();
    return users.map(user => {
        const { password: _password, ...userResponse } = user;
        return userResponse;
    });
}

const getUserById = async (userId) => {
    const user = await User.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const { password: _password, ...userResponse } = user;
    return userResponse;
};

const updateUserById = async (userId, updatedData, requesterRole = 'customer') =>{
    const existingUser = await User.findUnique({ where: { id: userId } });
    if (!existingUser) {
        throw new ApiError(404, 'User not found');
    }

    const allowedFields = ['name', 'phone', 'profileImage', 'password'];
    if (requesterRole === 'admin') allowedFields.push('role', 'isVerified');
    const safeData = Object.fromEntries(
        Object.entries(updatedData).filter(([key]) => allowedFields.includes(key))
    );
    if (Object.keys(safeData).length === 0) throw new ApiError(400, 'No permitted fields supplied');
    if (safeData.role && !['customer', 'admin'].includes(safeData.role)) throw new ApiError(400, 'Invalid role');
    if (typeof safeData.password !== 'undefined') delete safeData.password;
    if (updatedData.password) safeData.password = await bcrypt.hash(updatedData.password, 12);
    const updatedUser = await User.update({
        where: { id: userId },
        data: safeData
    });

    const { password: _password, ...userResponse } = updatedUser;
    return userResponse;
};

const deleteUserById = async (userId) => {
    const existingUser = await User.findUnique({ where: { id: userId } });
    if (!existingUser) {
        throw new ApiError(404, 'User not found');
    }

    const deletedUser = await User.delete({ where: { id: userId } });

    const { password: _password, ...userResponse } = deletedUser;
    return userResponse;
};

const loginUser = async (credentials) => {
    const { error, value } = loginValidation.validate(credentials);
    if (error) throw new ApiError(400, 'Validation error', error.details);

    const user = await User.findUnique({ where: { email: value.email } });
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) throw new ApiError(401, 'Invalid email or password');

    const { password: _password, ...userResponse } = user;
    return userResponse;
};


export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser

};