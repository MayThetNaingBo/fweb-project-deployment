// import { MongoClient } from "mongodb";

// const client = new MongoClient("mongodb://192.168.18.18:27017");

// let conn;
// try {
//     console.log("Connecting to MongoDB...");
//     conn = await client.connect();
//     console.log("Connected successfully to MongoDB");
// } catch (e) {
//     console.error("Failed to connect to MongoDB", e);
//     process.exit(1); // Exit if connection fails
// }


// const db = conn.db("CCA");

// client.on("serverOpening", () =>
//     console.log("MongoDB server connection opened")
// );
// client.on("serverClosed", () =>
//     console.log("MongoDB server connection closed")
// );
// client.on("serverDescriptionChanged", (event) =>
//     console.log("MongoDB server description changed:", event)
// );

// export default db;

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb+srv://may_25:May12345@clustermaythetnaingbo.gvqiq.mongodb.net/CCA?retryWrites=true&w=majority");

let conn;
try {
    console.log("Connecting to MongoDB...");
    conn = await client.connect();
    console.log("Connected successfully to MongoDB");
} catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1); // Exit if connection fails
}

