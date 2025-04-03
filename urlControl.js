const { nanoid } = require("nanoid"); // For generating short IDs
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

    const shortId = nanoid(8); // More descriptive variable name
    const shortUrl = `${req.protocol}://${req.get('host')}/api/url/${shortId}`; // Construct full short URL
    const expirationTimeMs = Date.now() + config.urlExpirationMs;
    const expirationTime = new Date(expirationTimeMs).toISOString(); // Format as UTC ISO string

    // Store the mapping in the in-memory hashmap
    urlMap.set(shortId, url);

    // Schedule deletion of that specific url after the expiration time
    setTimeout(() => {
      if (urlMap.has(shortId)) {
        console.log(`Deleting shortUrl ID => ${shortId} from HashMap`);
        urlMap.delete(shortId);
      }
    }, config.urlExpirationMs);

    // Logging for debugging
    const now = new Date();
    const expires = new Date(expirationTimeMs);
    console.log(`Current time (PST): ${now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`);
    console.log(`Current time (PKT): ${now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}`);
    console.log(`Expires at (UTC): ${expirationTime}`);
    console.log(`Expires at (PKT): ${expires.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}`);
    console.log(`HashMap: shortId => ${shortId}, longUrl => ${url}`);
    console.log("Full HashMap: ", Array.from(urlMap.entries()));

    res.status(201).json({ // Use 201 Created for successful resource creation
      longUrl: url,
      shortUrl: shortUrl,
      expiresAt: `expires on ${expires}`, // This is in UTC
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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