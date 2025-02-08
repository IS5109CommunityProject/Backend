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

  router.patch("/:studentNo", upload.single("medicalFile"), async (req, res) => {
    try {
      const { studentNo, name, academicYear, department, medicalDetails } = req.body
      const updateData = {
        name,
        academicYear,
        department,
        medicalDetails: JSON.parse(medicalDetails),
      }
      if (req.file) {
        updateData.medicalFile = req.file.path
      }
      const updatedMedical = await Medical.findOneAndUpdate({ studentNo: req.params.studentNo }, updateData, {
        new: true,
      })
      if (!updatedMedical) {
        return res.status(404).json({ message: "Medical record not found" })
      }
      res.json({
        message: "Medical record updated successfully",
        medical: {
          id: updatedMedical._id,
          studentNo: updatedMedical.studentNo,
          name: updatedMedical.name,
          academicYear: updatedMedical.academicYear,
          department: updatedMedical.department,
          medicalDetails: updatedMedical.medicalDetails,
          medicalFile: updatedMedical.medicalFile,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error updating exam medical record" })
    }
  })

  router.patch("/approve/:id", async (req, res) => {
    try {
      const updatedStatus = await Medical.findByIdAndUpdate(
        req.params.id, 
        { approveStatus: req.body.approveStatus }, 
        { new: true }
      );
  
      if (!updatedStatus) {
        return res.status(404).json({ message: "Medical record not found" });
      }
  
      res.json({
        message: "Medical record approved successfully",
        medical: updatedStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating medical record" });
    }
  });
  
  router.delete("/:studentNo", async (req, res) => {
    try {
      const deletedMedical = await Medical.findOneAndDelete({ studentNo: req.params.studentNo })
      if (!deletedMedical) {
        return res.status(404).json({ message: "Medical record not found" })
      }
      res.json({ message: "Medical record deleted successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error deleting  medical record" })
    }
  })
  
    
  
  
  export default router;
