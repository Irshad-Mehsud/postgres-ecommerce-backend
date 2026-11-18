import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getWishlistController, addWishlistProductController, removeWishlistProductController } from '../controllers/wishlistController.js';
const router = Router();
router.use(authMiddleware);
router.get('/', getWishlistController);
router.post('/products', addWishlistProductController);
router.delete('/products/:productId', removeWishlistProductController);
export default router;
