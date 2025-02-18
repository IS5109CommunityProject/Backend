import express from "express";
import path from "path";
import { Announcement } from "../models/announcementSchema.js";
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
      const { title, description, postDate } = req.body;
  
      if (!title || !description || !postDate) {
        return res.status(400).json({ message: "All fields are required!" });
      }
  
      const newAnnouncement = new Announcement({
        title,
        description,
        postDate,
      });
  
      await newAnnouncement.save();
  
      res.status(201).json({
        message: "New Announcement submitted successfully",
        announcement: {
          _id: newAnnouncement._id,
          title: newAnnouncement.title,
          description: newAnnouncement.description,
          postDate: newAnnouncement.postDate,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error submitting new announcement" });
    }
  });
  

  router.get("/", async (req, res) => {
    try {
      const announcements = await Announcement.find();
      res.json(announcements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching Announcement" });
    }
  });


  
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: "Error fetching announcement" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Announcement updated successfully!", updatedAnnouncement });
  } catch (error) {
    res.status(500).json({ error: "Error updating announcement" });
  }
});
  
  router.delete("/:id", async (req, res) => {
    try {
      const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
  
      if (!deletedAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
  
      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting announcement" });
    }
  });
  
  export default router;