import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectName: String,
  dateOfAbsent: Date
});

const medicalSchema = new mongoose.Schema({
  studentNo: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  medicalType: {
    type: String,
    enum: ['Exam', 'Lecture'],
    required: true
  },
  subjects: [subjectSchema],
  medicalDocumentPath: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

const Medical = mongoose.model('Medical', medicalSchema);