import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import examMedicalRoutes from "./routes/examMedical.js"

dotenv.config();

mongoose.connect(process.env.MONGO).then(() =>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

const app = express();

app.use('/medical', examMedicalRoutes);

app.listen(3001, () =>{
    console.log('server run on port 3001');
}
)