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
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
// Add Member with Email Verification
router.post("/add/members", async (req, res) => {
    const { name, school, email } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingMember = await Member.findOne({ email: normalizedEmail });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists." });
        }

        // Generate a unique verification token and expiry
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

        // Create new member
        const newMember = new Member({
            name,
            school,
            email: normalizedEmail,
            verificationToken: token,
            tokenExpiry,
        });

        await newMember.save();

        // Create a verification link
        const verificationLink = `http://localhost:5173/create-password?token=${token}`;

        // Send the email
        const mailOptions = {
            from: process.env.EMAIL,
            to: normalizedEmail,
            subject: "CCA Password Setup",
            html: `<p>Hi ${name},</p>
                   <p>You have been added as a member. Click the link below to set up your password:</p>
                   <a href="${verificationLink}">Set Your Password</a>
                   <p>This link will expire in 24 hours.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Member added successfully. Verification email sent!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member.",
            error: error.message,
        });
    }
});

// Verify Token and Set Password
router.post("/create-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the member by the verification token
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is still valid
        });

        if (!member) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the password and mark the member as verified
        const hashedPassword = await bcrypt.hash(password, 10);
        member.password = hashedPassword; // Add password field in the schema if needed
        member.isVerified = true;
        member.verificationToken = undefined; // Clear the token
        member.tokenExpiry = undefined;

        await member.save();

        res.status(200).json({ message: "Password set successfully. You can now log in!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to set password.", error: error.message });
    }
});
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
const Feedback =
    mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

// Admin Signup
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });

        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin signed up successfully",
            email: newAdmin.email,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to sign up admin",
            error: error.message,
        });
    }
});

// Admin Sign-In
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const admin = await Admin.findOne({ email: normalizedEmail });

        if (!admin) {
            return res.status(400).json({ error: "Admin not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Incorrect password." });
        }

        res.status(200).json({
            message: "Admin sign-in successful.",
            role: "admin",
            userId: admin._id.toString(),
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

// Add Member with Email Verification
router.post("/add/members", async (req, res) => {
    const { name, school, email } = req.body;

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const existingMember = await Member.findOne({ email: normalizedEmail });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists." });
        }

        // Generate a unique verification token and expiry
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours

        // Create new member
        const newMember = new Member({
            name,
            school,
            email: normalizedEmail,
            verificationToken: token,
            tokenExpiry,
        });

        await newMember.save();

        // Create a verification link
        const verificationLink = `http://localhost:5173/create-password?token=${token}`;

        // Send the email
        const mailOptions = {
            from: process.env.EMAIL,
            to: normalizedEmail,
            subject: "CCA Password Setup",
            html: `<p>Hi ${name},</p>
                   <p>You have been added as a member. Click the link below to set up your password:</p>
                   <a href="${verificationLink}">Set Your Password</a>
                   <p>This link will expire in 24 hours.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Member added successfully. Verification email sent!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add member.",
            error: error.message,
        });
    }
});

// Verify Token and Set Password
router.post("/create-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find the member by the verification token
        const member = await Member.findOne({
            verificationToken: token,
            tokenExpiry: { $gt: new Date() }, // Ensure the token is still valid
        });

        if (!member) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the password and mark the member as verified
        const hashedPassword = await bcrypt.hash(password, 10);
        member.password = hashedPassword; // Add password field in the schema if needed
        member.isVerified = true;
        member.verificationToken = undefined; // Clear the token
        member.tokenExpiry = undefined;

        await member.save();

        res.status(200).json({ message: "Password set successfully. You can now log in!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to set password.", error: error.message });
    }
});
// Admin Update Member
router.put("/update/members/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, school } = req.body;

    try {
        // Fetch the existing member to compare values
        const existingMember = await Member.findById(id);

        if (!existingMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Check if there are any actual updates
        const isSame =
            name === existingMember.name &&
            email === existingMember.email &&
            school === existingMember.school;

        if (isSame) {
            return res.status(200).json({ message: "No changes made." });
        }

        // Perform the update
        const updatedMember = await Member.findByIdAndUpdate(
            id,
            { name, email, school },
            { new: true }
        );

        res.status(200).json({
            message: "Member updated successfully!",
            updatedMember,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update member." });
    }
});

// Admin Get All Members
router.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

// Admin Get Member by ID
router.get("/members/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch member." });
    }
});

// Admin Delete Member
router.delete("/delete/members/:id", async (req, res) => {
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

// Admin Get All Events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events" });
    }
});
// Admin Get Event by ID
router.get("/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch event." });
    }
});

// Admin Add Events
router.post("/add/events", async (req, res) => {
    const { title, location, date, description, image } = req.body;

    try {
        const newEvent = new Event({
            title,
            location,
            date,
            description,
            image,
        });
        await newEvent.save();

        res.status(201).json({
            message: "Event added successfully",
            newEvent,
        });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({
            message: "Failed to add event",
            error: error.message,
        });
    }
});

// Admin Update Events
router.get("/update/events/:id", async (req, res) => {
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

// Admin Updates Events
router.put("/update/events/:id", async (req, res) => {
    const { id } = req.params;
    let { title, location, date, description, image } = req.body;

    try {
        // Find the existing event
        const existingEvent = await Event.findById(id);
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Set default image if not provided
        if (!image) {
            image = "http://localhost:5173/assets/NoImage.jpg";
        }

        // Check if there are any actual updates
        const isSame =
            title === existingEvent.title &&
            location === existingEvent.location &&
            date === existingEvent.date &&
            description === existingEvent.description &&
            image === existingEvent.image;

        if (isSame) {
            return res.status(200).json({ message: "No changes made." }); // Send a different response
        }

        // Set default image if not provided
        if (!image || image.trim() === "") {
            image =
                existingEvent.image ||
                "http://localhost:5173/assets/NoImage.jpg";
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                title: title || existingEvent.title,
                location: location || existingEvent.location,
                date: date || existingEvent.date,
                description: description || existingEvent.description,
                image: image, // Use default image if missing
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Event updated successfully",
            updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
            message: "Failed to update event",
            error: error.message,
        });
    }
});

// Admin Delete Events
router.delete("/delete/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message,
        });
    }
});

// Admin Get All Feedback
router.get("/feedback", async (req, res) => {
    try {
        const feedbackList = await Feedback.find().sort({ submittedAt: -1 });
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch feedback.",
        });
    }
});

// Admin Fetch Member For Specific Event
router.get("/events/:id/members", async (req, res) => {
    const { id } = req.params; // Event ID from URL
    try {
        const event = await Event.findById(id).populate("members"); // Populate members for event
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json(event.members); // Send event members
    } catch (error) {
        console.error("Error fetching event members:", error);
        res.status(500).json({ message: "Failed to fetch event members." });
    }
});

// Admin Add Member To Specific Event
router.post("/events/:id/add-member", async (req, res) => {
    const { id } = req.params; // Event ID
    const { memberId } = req.body; // Member ID from request body

    try {
        const event = await Event.findById(id); // Find event by ID
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Check if the member already exists in the event
        if (event.members.includes(memberId)) {
            return res.status(400).json({ message: "Member already added." });
        }

        // Add member to the event
        event.members.push(memberId);
        await event.save();

        res.status(200).json({ message: "Member added successfully!" });
    } catch (error) {
        console.error("Error adding member to event:", error);
        res.status(500).json({ message: "Failed to add member to event." });
    }
});

// Admin Remove Member From Specific Event
router.post("/events/:id/remove-member", async (req, res) => {
    const { userId } = req.body;

    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // Remove user from the 'members' array only
        event.members = event.members.filter((id) => id.toString() !== userId);

        await event.save();

        res.json({ success: true, message: "Member removed successfully." });
    } catch (err) {
        console.error("Error removing member:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Admin Delete Member From Specific Event
router.delete("/events/:id/remove-member/:userId", async (req, res) => {
    const { id, userId } = req.params; // Event ID and Member ID

    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        event.members = event.members.filter(
            (memberId) => memberId.toString() !== userId
        );

        await event.save(); // Save the updated event

        res.json({ success: true, message: "Member removed successfully." });
    } catch (err) {
        console.error("Error removing member:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get Admin Info by ID
router.get("/profile/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id).select("-password"); // Exclude password
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).json({ message: "Failed to fetch admin data." });
    }
});

// Admin Change Password
router.put("/profile/change-password", async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Check if the current password is valid
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            admin.password
        );
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ message: "Invalid current password." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        res.status(500).json({ message: "Failed to change password." });
    }
});

export default router;
