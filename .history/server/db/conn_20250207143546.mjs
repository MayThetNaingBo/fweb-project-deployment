import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://<your-laptop-ip>:27017"); // Replace <your-laptop-ip> with your laptop's IP address

let conn;
try {
    console.log("Connecting to MongoDB");
    conn = await client.connect();
    console.log("Connected successfully to MongoDB");
} catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1); // Exit if connection fails
}

const db = conn.db("CCA");

// Optional: Event listeners for connection status
client.on("serverOpening", () =>
    console.log("MongoDB server connection opened")
);
client.on("serverClosed", () =>
    console.log("MongoDB server connection closed")
);
client.on("serverDescriptionChanged", (event) =>
    console.log("MongoDB server description changed:", event)
);

export default db; // Export database
