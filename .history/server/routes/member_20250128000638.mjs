import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    tokenExpiry: { type: Date },
    role: { type: String, default: "member" },
    createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: String,
    date: String,
    description: String,
    registrationRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    ],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

router.get("/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event" });
    }
});

router.post("/events/:id/register-request", async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (
            event.registrationRequests.includes(memberId) ||
            event.members.includes(memberId)
        ) {
            return res
                .status(400)
                .json({ error: "Already registered or requested." });
        }

        event.registrationRequests.push(memberId);
        await event.save();

        res.status(200).json({
            success: true,
            message: "Registration request sent.",
        });
    } catch (error) {
        console.error("Error registering member for event:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
