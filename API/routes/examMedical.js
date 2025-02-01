import express from "express";
import multer from "multer";
import path from "path";
import { Medical } from "../models/medicalSchema.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

router.post("/add", async (req, res) => {
  try {
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("Request body:", req.body);

    let records;
    if (req.is("application/json")) {
      records = req.body.records; 
    } else {
      throw new Error("Invalid Content-Type. Expected application/json.");
    }

    console.log("Parsed records:", records);

    if (!Array.isArray(records)) {
      throw new Error("Invalid records format. Expected an array.");
    }

    if (records.length === 0) {
      throw new Error("No records to process.");
    }

    const medicalRecords = records.map((record, index) => {
      if (!record || typeof record !== "object") {
        console.error(`Invalid record at index ${index}:`, record);
        return null; 
      }

      return {
        studentNo: record.studentNo || "",
        name: record.name || "",
        academicYear: record.academicYear || "",
        department: record.department || "",
        approveStatus: "Pending", 
        medicalFile: "", 
        medicalDetails: record.medicalDetails.map((detail) => ({
          subjectCode: detail.subjectCode || "",
          subjectName: detail.subjectName || "",
          dateOfAbsent: detail.dateOfAbsent
            ? new Date(detail.dateOfAbsent)
            : new Date(),
        })),
      };
    });

    const validMedicalRecords = medicalRecords.filter(
      (record) => record !== null
    );

    if (validMedicalRecords.length === 0) {
      throw new Error("No valid records to insert.");
    }

    const result = await Medical.insertMany(validMedicalRecords);

    res.status(201).json({
      message: "Medical records created successfully.",
      count: result.length,
    });
  } catch (error) {
    console.error("Error creating medical records:", error);
    res.status(400).json({
      message: "Error creating medical records",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const medicals = await Medical.find();
    res.json(medicals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exam medical records" });
  }
});

router.get("/:studentNo", async (req, res) => {
  try {
    const medical = await Medical.findOne({ studentNo: req.params.studentNo });
    if (!medical) {
      return res.status(404).json({ message: "medical not found" });
    }
    res.json(medical);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching student exam medical record" });
  }
});

router.patch("/:studentNo", upload.single("medicalFile"), async (req, res) => {
  try {
    const { studentNo, name, academicYear, department, medicalDetails } =
      req.body;
    const updateData = {
      name,
      academicYear,
      department,
      approveStatus,
      medicalDetails: JSON.parse(medicalDetails),
    };
    if (req.file) {
      updateData.medicalFile = req.file.path;
    }
    const updatedMedical = await Medical.findOneAndUpdate(
      { studentNo: req.params.studentNo },
      updateData,
      {
        new: true,
      }
    );
    if (!updatedMedical) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.json({
      message: "Medical record updated successfully",
      medical: {
        id: updatedMedical._id,
        studentNo: updatedMedical.studentNo,
        name: updatedMedical.name,
        approveStatus: updatedMedical.approveStatus,
        academicYear: updatedMedical.academicYear,
        department: updatedMedical.department,
        medicalDetails: updatedMedical.medicalDetails,
        medicalFile: updatedMedical.medicalFile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating exam medical record" });
  }
});

router.patch("/approve:id", async(req,res)=>{
  try{
    const updatedStatus=await Medical.findByIdAndUpdate(
      req.params.id,{approveStatus:"Approved"},{new:true}
    );

    if(updatedStatus!=null){
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json({
      message: "Medical record approved successfully",
      medical: updatedMedical,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating medical record" });
  }
});

router.delete("/:studentNo", async (req, res) => {
  try {
    const deletedMedical = await Medical.findOneAndDelete({
      studentNo: req.params.studentNo,
    });
    if (!deletedMedical) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting exam medical record" });
  }
});

export default router;
