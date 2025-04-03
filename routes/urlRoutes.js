const express = require("express");
const {
  shortenUrl,
  redirectToLongUrl,
  getOriginalUrl,
} = require("../urlControl");

const router = express.Router();

// Route to create a short URL
router.post("/", shortenUrl); // Changed path to "/" because it's under /api/url now

// Route to redirect to the long URL (consider if you still need this direct route)
router.get("/:hash", redirectToLongUrl); // Kept for now, but think about its purpose

// Route to fetch the original long URL
router.get("/fetch/:hash", getOriginalUrl); // Kept for now

module.exports = router;