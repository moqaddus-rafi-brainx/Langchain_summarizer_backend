import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import uploadRoutes from './routes/uploadRoutes.js';
dotenv.config();

//Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
 
});

export default app;
