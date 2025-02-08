import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import examMedicalRoutes from './routes/examMedical.js';
import userRoute from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import cors from 'cors';

dotenv.config();

const app = express(); // Initialize Express before using it

// Enable CORS
app.use(cors());

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use('/medical', examMedicalRoutes);
app.use('/user', userRoute);
app.use('/api/auth', authRoutes);

app.listen(3002, () => {
  console.log('Server running on port 3002');
});
