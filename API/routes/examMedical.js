import express from 'express';
import multer from 'multer';
import path from 'path';
import { Medical } from '../models/medicalSchema.js'; 
const router=express.Router()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    }
  });
  
  router.post('/add', upload.single('medicalFile'), async (req, res) => {
    try {
      const { studentNo, name, academicYear, department, medicalDetails } = req.body;
      
      const newMedical = new Medical({
        studentNo,
        name,
        academicYear,
        department,
        medicalDetails: JSON.parse(medicalDetails),
        medicalFile: req.file ? req.file.path : null
      });
  
      await newMedical.save();
      res.status(201).json({ message: 'Exam medical details submitted successfully', medical: newMedical });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error submitting exam medical details' });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const medicals = await Medical.find();
      res.json(medicals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching exam medical records' });
    }
  });
  
  router.get('/:studentNo', async (req, res) => {
    try {
      const medical = await Medical.findOne({ studentNo: req.params.studentNo });
      if (!medical) {
        return res.status(404).json({ message: 'medical not found' });
      }
      res.json(medical);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching student exam medical record' });
    }
  });
  
  export default router;
