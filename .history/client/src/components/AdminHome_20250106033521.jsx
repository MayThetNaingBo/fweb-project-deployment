import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

// Schemas
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
});

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", adminSchema);
const Member = mongoose.model("Member", memberSchema);

// Get All Members
router.get("/members", async (req, res) => { // Fixed endpoint
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

// Delete Member
router.delete("/members/:id", async (req, res) => { // Fixed endpoint
    const { id } = req.params;

    try {
        const deletedMember = await Member.findByIdAndDelete(id);
        if (!deletedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete member" });
    }
});

export default router;
