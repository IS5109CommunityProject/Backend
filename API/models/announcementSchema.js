import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  postDate: { type: Date, required: true, default: Date.now },
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export { Announcement };
