import express from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

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
    role: { type: String, default: "member" },
    createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: String,
    date: String,
    description: String,
    registrationRequests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
        default: [],
    },
    members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
        default: [],
    },
});

const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
// Validate Token
router.get("/validate-token", async (req, res) => {
    const { token } = req.query;

    try {
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is valid
        });

        if (!member) {
            console.error("Invalid or expired token:", token);
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
        console.log("Received token for password setup:", token);

        // Find the member by the verification token
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is valid
        });

        if (!member) {
            console.error("Invalid or expired token:", token);
            return res
                .status(400)
                .json({ message: "Invalid or expired token." });
        }

        console.log("Member found for token:", member.email);

        // Hash the password and mark the member as verified
        let hashedPassword;
        try {
            hashedPassword = await bcryptjs.hash(password, 10);
            console.log("Password hashed successfully.");
        } catch (hashError) {
            console.error("Error hashing password:", hashError);
            return res
                .status(500)
                .json({ message: "Password hashing failed." });
        }

        member.password = hashedPassword;
        member.isVerified = true;
        member.verificationToken = undefined; // Clear the token
        member.tokenExpiry = undefined;

        console.log("Saving member with updated details...");
        await member.save();
        const savedMember = await Member.findById(member._id);
        console.log("Saved member:", savedMember);
        console.log("Password set successfully for member:", member.email);
        console.log(
            "Member saved with password:",
            await Member.findOne({ email: member.email })
        );

        res.status(200).json({
            message: "Password set successfully. You can now log in!",
        });
    } catch (error) {
        console.error("Error in /create-password:", error);
        res.status(500).json({
            message: "Failed to set password.",
            error: error.message,
        });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find member by email
        const member = await Member.findOne({ email: normalizedEmail });
        if (!member) {
            console.error("No member found with email:", normalizedEmail);
            return res
                .status(400)
                .json({ message: "Invalid email or password." });
        }

        console.log("Member found for signin:", member.email);

        // Check if password exists
        if (!member.password) {
            console.error("Password not set for email:", normalizedEmail);
            return res.status(400).json({
                message: "Password not set. Please create a password.",
            });
        }

        // Check password
        const isMatch = await bcryptjs.compare(password, member.password);
        if (!isMatch) {
            console.error("Password mismatch for email:", normalizedEmail);
            return res
                .status(400)
                .json({ message: "Invalid email or password." });
        }

        if (!member.isVerified) {
            console.error("Unverified account for email:", normalizedEmail);
            return res
                .status(400)
                .json({ message: "Please verify your account first." });
        }

        console.log("Sign-in successful for member:", member.email);

        // Respond with member details (excluding sensitive information)
        res.status(200).json({
            message: "Sign-in successful.",
            member: {
                id: member._id,
                name: member.name,
                email: member.email,
                school: member.school,
                role: member.role,
            },
        });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Server error." });
    }
});

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
router.get("/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event); // Ensure the full event object, including `description`, is returned
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Failed to fetch event" });
    }
});
router.post("/events/:id/register-request", async (req, res) => {
    const { id } = req.params; // Event ID
    const { memberId } = req.body; // Member ID

    try {
        console.log("Received MemberId:", memberId); // Debugging MemberId

        // Find the event
        const event = await Event.findById(id);
        if (!event) {
            console.error("Event not found with ID:", id);
            return res.status(404).json({ error: "Event not found" });
        }

        console.log("Event found:", event.title); // Debugging Event

        // Ensure the arrays exist and are valid
        if (!Array.isArray(event.registrationRequests)) {
            event.registrationRequests = [];
        }
        if (!Array.isArray(event.members)) {
            event.members = [];
        }

        // Check if the memberId is already in registrationRequests or members
        if (
            event.registrationRequests.includes(memberId) ||
            event.members.includes(memberId)
        ) {
            console.warn(
                "Already registered or requested for memberId:",
                memberId
            );
            return res
                .status(400)
                .json({ error: "Already registered or requested." });
        }

        // Add the memberId to registrationRequests
        event.registrationRequests.push(memberId);
        await event.save();

        console.log("Updated Requests:", event.registrationRequests); // Debugging

        res.status(200).json({
            success: true,
            message: "Registration request sent.",
        });
    } catch (err) {
        console.error("Error registering member for event:", err);
        res.status(500).json({ error: "Server error" });
    }
});
router.put("/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the member by email
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(404).json({ message: "Member not found." });
        }

        // Check if the current password is valid
        const isPasswordValid = await bcryptjs.compare(
            currentPassword,
            member.password
        );
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid current password." });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update the member's password
        member.password = hashedPassword;
        await member.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ message: "Failed to change password." });
    }
});

// Get Member Info by ID
router.get("/members/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find member by ID
        const member = await Member.findById(id).select("-password"); // Exclude password
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Send member details
        res.status(200).json(member);
    } catch (error) {
        console.error("Error fetching member:", error);
        res.status(500).json({ message: "Failed to fetch member data." });
    }
});
router.get("/members/:id/events", async (req, res) => {
    const { id } = req.params; // Member ID

    try {
        // Fetch events where the member is in the 'members' array
        const events = await Event.find({ members: id });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this member." });
        }

        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching member events:", err);
        res.status(500).json({ error: "Server error." });
    }
});


export default router;
