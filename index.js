const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlRouter = require("./routes/urlRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/", urlRouter);

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
