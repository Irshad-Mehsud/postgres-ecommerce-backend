// import {createUser,getAllUsers} from '../services/userService.js';
import {Router} from 'express';
import { CreateUserController, GetAllUsersController, GetUserByIdController, deleteUserController, UpdateUserController, LoginUserController } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/authrizeRole.js';
import multer from 'multer';

const router = Router();

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadUserImage = upload.fields([
	{ name: 'profileImage', maxCount: 1 },
	{ name: 'image', maxCount: 1 },
]);

router.post('/', uploadUserImage, CreateUserController);
router.post('/login', LoginUserController);
router.get('/', authMiddleware, authorizeRole(['admin']), GetAllUsersController);
router.get('/:id', authMiddleware, GetUserByIdController);
router.put('/:id', authMiddleware, authorizeRole(['admin']), uploadUserImage, UpdateUserController);
router.delete('/:id', authMiddleware, authorizeRole(['admin']), deleteUserController);


export default router;