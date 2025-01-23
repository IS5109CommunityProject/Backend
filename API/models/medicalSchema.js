import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  subjectCode: String,
  subjectName: String,
  dateOfAbsent: Date
});

const medicalSchema = new mongoose.Schema({
  studentNo: String,
  name: String,
  academicYear: String,
  department: String,
  medicalDetails: [subjectSchema],
  medicalFile: String
});

const Medical = mongoose.model('Medical', medicalSchema);
export { Medical }; 