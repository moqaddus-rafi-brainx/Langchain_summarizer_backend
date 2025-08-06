import express from 'express';
import upload from '../config/multer.js';
import { generateSummary, humanApproval } from '../controllers/summaryController.js';

const router = express.Router();

router.post('/load-document', upload.single('document'), generateSummary);
router.post('/save-summary', humanApproval);


export default router; 