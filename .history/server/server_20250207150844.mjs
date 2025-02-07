import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.mjs"; // Import admin routes
import publicRoutes from "./routes/user.mjs"; // Import public user routes
import memberRoutes from "./routes/member.mjs";

dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://192.168.18.18:27017/CCA", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/admin", adminRoutes); // Prefix admin routes with "/api/admin"
app.use("/api/public", publicRoutes);
app.use("/api/member", memberRoutes);

// Start Server
const PORT = 5050;
app.listen(PORT, () =>
    console.log(`Server running at http://192.168.18.18:${PORT}`)
);
