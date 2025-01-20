const { nanoid } = require("nanoid"); // For generating short IDs
const axios = require("axios");
const config = require("./config.json");

// In-memory hashmap to store URL mappings
const urlMap = new Map();

// Generate a short URL
exports.shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "Long URL is required" });
    }

    const shortUrl = nanoid(8); // Generate an 8-character short URL

    // Store the mapping in the in-memory hashmap
    urlMap.set(shortUrl, url);

    // Schedule deletion of that specific url after the expiration time
    setTimeout(() => {
      if (urlMap.has(shortUrl)) {
        console.log(`Deleting shortUrl => ${shortUrl} from HashMap`);
        urlMap.delete(shortUrl);
      }
    }, config.urlExpirationMs);

    // Logging for debugging
    console.log(`HashMap: shortUrl => ${shortUrl}, longUrl => ${url}`);
    console.log("Full HashMap: ", Array.from(urlMap.entries()));

    res.json({
      longUrl: url,
      shortUrl: `http://localhost:4200/assets/web-published-form/?id=${shortUrl}`,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//not used now
// Redirect to the long URL
exports.redirectToLongUrl = async (req, res) => {
  try {
    const { hash } = req.params;

    const longUrl = urlMap.get(hash);

    if (!longUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    console.log(`Redirecting: Hash => ${hash}, Long URL => ${longUrl}`);

    // Directly redirect to the long URL
    res.redirect(longUrl);
  } catch (error) {
    console.error("Error redirecting to long URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get the original long URL based on the short URL hash
exports.getOriginalUrl = async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({ message: "Hash parameter is missing" });
    }

    const longUrl = urlMap.get(hash);

    if (!longUrl) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    console.log(`Fetched URL: Hash => ${hash}, Long URL => ${longUrl}`);
    res.status(200).json({ longUrl });
  } catch (error) {
    console.error("Error fetching original URL:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
