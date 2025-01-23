import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js'


dotenv.config();

mongoose.connect(process.env.MONGO).then(() =>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

const app = express();

app.listen(3002, () =>{
    console.log('server run on port 3002');
}
);

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/api/auth", authRoutes);
