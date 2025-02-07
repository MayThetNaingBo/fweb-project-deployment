import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schemas
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    school: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For hashed password
    isVerified: { type: Boolean, default: false }, // To track verification
    verificationToken: { type: String },
    tokenExpiry: { type: Date },
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
const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
const Feedback =
    mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);


    // Validate Token
router.get("/validate-token", async (req, res) => {
    const { token } = req.query;

    try {
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is valid
        });

        if (!member) {
            return res.status(400).json({ valid: false });
        }

        res.status(200).json({ valid: true });
    } catch (error) {
        console.error("Error validating token:", error);
        res.status(500).json({ valid: false });
    }
});

router.post("/create-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the member by the verification token
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is valid
        });

        if (!member) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the password and mark the member as verified
        const hashedPassword = await bcrypt.hash(password, 10);
        member.password = hashedPassword;
        member.isVerified = true;
        member.verificationToken = undefined; // Clear the token
        member.tokenExpiry = undefined;

        await member.save();

        res.status(200).json({
            message: "Password set successfully. You can now log in!",
        });
    } catch (error) {
        console.error("Error in /create-password:", error); // Log the error
        res.status(500).json({
            message: "Failed to set password.",
            error: error.message,
        });
    }
});


export default router;
