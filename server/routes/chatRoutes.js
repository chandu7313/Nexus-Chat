import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { getChats, accessChat, createGroupChat } from '../controllers/chatController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

router.get('/', getChats);
router.post('/', accessChat); // For 1:1 chats
router.post('/group', createGroupChat); // For Group chats

export default router;
