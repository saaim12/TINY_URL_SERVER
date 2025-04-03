const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlRouter = require("./routes/urlRoutes");
const config = require("./config.json"); // Assuming you have this

const app = express();

// Middleware
app.use(bodyParser.json());

// Configure CORS for all origins (as requested)
const corsOptions = {
  origin: "*", // This allows all origins - be cautious in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to handle cookies across origins
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Use the URL routes
app.use("/api/url", urlRouter); // It's good practice to prefix your API routes

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Handle 404 errors (no matching routes)
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Error handling middleware (important for catching unexpected errors)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || config.port || 3001; // Use environment variable, config, or default
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});