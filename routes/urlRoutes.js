const express = require("express");
const {
  shortenUrl,
  redirectToLongUrl,
  getOriginalUrl,
} = require("../urlControl");

const router = express.Router();

// Route to create a short URL
router.post("/shortenURL", shortenUrl);

// Route to redirect to the long URL
router.get("/:hash", redirectToLongUrl);

// Route to fetch the original long URL
router.get("/fetch/:hash", getOriginalUrl);

module.exports = router;
