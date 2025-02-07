import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: String,
    date: String,
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }], // Reference to Member
});
const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});

// Models
const Feedback = mongoose.model("Feedback", feedbackSchema);
const Event = mongoose.model("Event", eventSchema);
const Member = mongoose.model("Member", memberSchema);


// Get All Members
router.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

// Get All Events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

// Add Feedback
router.post("/feedback", async (req, res) => {
    const { email, message } = req.body;

    try {
        const newFeedback = new Feedback({ email, message });
        await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to submit feedback.",
        });
    }
});

export default router;