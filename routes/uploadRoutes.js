import express from 'express';
import multer from 'multer';
import { generateSummary, humanApproval } from '../controllers/summaryController.js';

const router = express.Router();

const upload = multer({ 
  dest: '/tmp/'
});
router.post('/load-document', upload.single('document'), generateSummary);
router.post('/save-summary', humanApproval);


export default router; 