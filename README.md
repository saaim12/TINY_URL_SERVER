<h1 align="center"> URL Shortener Service: The Elegant Simplicity 🔗</h1>

<p align="center">A streamlined URL shortener crafted with <font color="#61DAFB">Node.js</font>, <font color="#61DAFB">Express</font>, and the lightning-fast in-memory <font color="#F7DF1E">HashMap</font>. Embracing simplicity without sacrificing power!</p>

<br>

## ✨ Delightful Features

* **<font color="#2ECC71">Effortless URL Shortening</font>**: Instantly condense lengthy URLs into neat, shareable nuggets.
* **<font color="#3498DB">Smooth Redirection</font>**: Guide your audience seamlessly from the short link to the intended web page.
* **<font color="#9B59B6">Direct Original URL Retrieval</font>**: Easily fetch the full URL associated with any valid short link.
* **<font color="#E67E22">Time-Bound URLs</font>**: Set an expiration date for your short links, perfect for temporary content or limited-time offers.
* **<font color="#1ABC9C">Secure & Unique Links</font>**: Generated with cryptographically random IDs, ensuring both security and uniqueness.

<br>

## 🚀 Getting Started

1.  **<font color="#3498DB">Clone the Magic</font>**:
    ```bash
    git clone <repository_url>
    cd url-shortener
    ```

2.  **<font color="#3498DB">Gather Dependencies</font>**:
    ```bash
    npm install
    ```

3.  **<font color="#3498DB">Configure the Cosmos (`config.json`)</font>**:
    Create a `config.json` file in the main folder:
    ```json
    {
      "urlExpirationMs": 3600000,
      "port": 3001
    }
    ```
    * `<font color="#E67E22">urlExpirationMs</font>`: The lifespan of your short URLs in milliseconds (e.g., `3600000` for a one-hour duration).
    * `<font color="#2ECC71">port</font>`: The port where the server will listen for incoming requests.

4.  **<font color="#3498DB">Ignite the Server</font>**:
    ```bash
    node index.js
    ```
    The service will be live at `http://localhost:<port>` (default: `http://localhost:3001`).

<br>

## 🌐 API Access Points

### 1. <font color="#2ECC71">The Shortening Portal</font>

* **Endpoint:** `POST /api/url/`
* **Payload (JSON):**
    ```json
    {
      "url": "your_super_long_url_here"
    }
    ```
* **Triumphant Return (JSON):**
    ```json
    {
      "longUrl": "your_super_long_url_here",
      "shortUrl": "http://localhost:3001/api/url/a1B2c3D4",
      "expiresAt": "2025-04-03T12:44:00.000Z"
    }
    ```
    * `<font color="#2ECC71">longUrl</font>`: Your original, lengthy URL.
    * `<font color="#2ECC71">shortUrl</font>`: The concise and shareable short URL.
    * `<font color="#E67E22">expiresAt</font>`: The UTC timestamp indicating the short URL's expiration.

### 2. <font color="#3498DB">The Redirection Gateway</font>

* **Endpoint:** `GET /api/url/:hash`
* **Path Parameter:**
    * `<font color="#3498DB">hash</font>`: The unique identifier embedded in the short URL (e.g., `a1B2c3D4`).
* **Action:** If the short URL is active, you'll be instantly redirected (HTTP 302) to the original long URL. If the link has expired or is invalid, a 404 error will be your guide.

### 3. <font color="#9B59B6">The Original Unveiler</font>

* **Endpoint:** `GET /api/url/fetch/:hash`
* **Path Parameter:**
    * `<font color="#9B59B6">hash</font>`: The unique identifier of the short URL.
* **Response (JSON):**
    ```json
    {
      "longUrl": "your_original_url_here"
    }
    ```
* **Outcome:** For a valid, unexpired short URL, you'll receive the original long URL in a JSON format. Otherwise, a 404 error will be returned.

<br>

## 🛡️ Security and Design Philosophy

* **<font color="#1ABC9C">Keeping Secrets Safe</font>**: When a short URL is accessed (`/api/url/:hash`), the resolution happens server-side. The long URL remains hidden from the user's browser address bar during redirection, enhancing privacy.
* **<font color="#1ABC9C">Guarding Against Guesswork</font>**: The `nanoid` library generates short URL identifiers that are cryptographically random and non-sequential. This makes it exceptionally difficult for anyone to guess valid short URLs, protecting against unauthorized access.
* **<font color="#1ABC9C">CORS Awareness</font>**: While currently configured to be open (`*`), **in a production environment, it's crucial to restrict the allowed origins** in your CORS settings to only the domains you trust, bolstering your application's security.

<br>

## 🚀 Performance Unleashed: The Power of the HashMap

* **<font color="#F7DF1E">Embracing Tradition: No Database Needed (For This Scale)</font>**: In this implementation, we intentionally steer away from traditional databases for storing URL mappings. Instead, we leverage the inherent speed and efficiency of an **in-memory HashMap** (JavaScript's `Map`). For many URL shortener use cases, especially those with moderate traffic and a focus on simplicity, an in-memory HashMap can be remarkably effective and eliminates the overhead of database interactions.
* **<font color="#F7DF1E">O(1) Speed: The Gold Standard</font>**: HashMaps boast an average time complexity of **O(1)** for fundamental operations like looking up (`get`), adding (`set`), and removing (`delete`) data. This means that retrieving the original long URL based on its short identifier is consistently fast, regardless of the number of URLs stored. This contributes significantly to the snappy performance of our redirection and fetching endpoints.
* **<font color="#F7DF1E">How the Magic Happens</font>**: When a short URL is created, the unique `hash` generated by `nanoid` serves as the key, and the corresponding long URL is stored as the value within our `urlMap`. When a request arrives to access a short URL, the server uses `urlMap.get(hash)` to perform an incredibly fast lookup and retrieve the associated long URL.
  **However, it's crucial to understand the implications for larger scale:**
    * **Memory Limits:** As the number of shortened URLs grows significantly (tens of thousands or millions), the memory usage will increase proportionally. Eventually, you could hit the memory limits of your server, leading to performance degradation or crashes.
    * **Persistence:** Data in an in-memory HashMap is volatile. If the server restarts for any reason, all the URL mappings will be lost. This is a significant drawback for a production system where uptime and data persistence are critical.
    * **Scaling:** Scaling horizontally (adding more servers) with an in-memory HashMap requires careful consideration of how to share or replicate the `urlMap` across instances to ensure consistency.

    For high-traffic, production-level URL shorteners, a persistent database is typically the preferred solution to handle large datasets, ensure data durability across server restarts, and facilitate horizontal scaling more effectively. This in-memory approach is excellent for learning, smaller-scale applications, or scenarios where temporary short URLs are acceptable.

<br>

## 🔄 The Complete Journey of a Shortened Link

1.  **<font color="#2ECC71">Initiation: The Shorten Request</font>**: Your application sends a `POST` request to `/api/url/` with the long URL you wish to condense.
2.  **<font color="#2ECC71">Transformation: Server-Side Processing</font>**:
    * The server receives your long URL.
    * A unique and secure `shortId` (the `hash`) is generated.
    * A complete `shortUrl` is constructed (e.g., `http://localhost:3001/api/url/a1B2c3D4`).
    * A crucial link between the `shortId` and the `longUrl` is established and stored in our in-memory `urlMap`.
    * A timer is set to automatically remove this link from the `urlMap` after the `expiresAt` duration.
    * The server sends back a response containing the original URL, the newly created short URL, and its expiration timestamp (in UTC).
3.  **<font color="#3498DB">Navigation: The Redirection Flow</font>**:
    * A user clicks on the generated `shortUrl`.
    * Their browser sends a `GET` request to `/api/url/a1B2c3D4`.
    * The server swiftly looks up the `hash` (`a1B2c3D4`) in the `urlMap`.
    * If the `hash` is found and the link is still active, the server sends an HTTP 302 redirect response, instructing the browser to navigate to the original `longUrl`.
4.  **<font color="#9B59B6">Retrieval: Accessing the Source</font>**:
    * Your application sends a `GET` request to `/api/url/fetch/a1B2c3D4`.
    * The server performs a quick lookup of the `hash` in the `urlMap`.
    * If the link is valid, the server responds with a 200 OK status and a JSON body containing the original `longUrl`.

<br>

## ⏳ Expiration in Action: The Survey Submission Timeline

Consider a survey form with a lengthy URL. You shorten it, and the response provides an `expiresAt` timestamp.

* **<font color="#2ECC71">Active Period</font>**: As long as the current time is before the `expiresAt` timestamp, anyone clicking the short URL will be seamlessly redirected to your survey form, allowing them to submit their responses.
* **<font color="#E67E22">The Expiration Point</font>**: Once the `expiresAt` time is reached:
    * The corresponding entry (the link between the `shortId` and the long survey URL) is automatically deleted from the `urlMap` by the scheduled `setTimeout` function.
    * If a user now tries to access the same short URL, the server will no longer find the `hash` in its `urlMap`.
    * Consequently, the server will respond with a 404 (Not Found) error, and the survey form will no longer be accessible through that specific, expired short link. To make the survey accessible again, you would need to generate a new short URL, which will have a fresh expiration timeframe. This mechanism provides a straightforward way to manage the availability of resources linked by short URLs.