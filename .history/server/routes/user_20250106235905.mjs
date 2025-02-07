


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