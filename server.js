const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Use Railway's dynamic port or default to 3000

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to fetch gamepasses
app.get("/gamepasses", async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }

    const url = `https://api.roblox.com/users/${userId}/owned-assets`;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        if (response.data && Array.isArray(response.data)) {
            // Filter gamepasses (AssetType 34 corresponds to Gamepasses)
            const gamepasses = response.data.filter(item => item.AssetType === 34).map((item) => ({
                id: item.AssetId,
                price: item.Product?.PriceInRobux || 0,
                name: item.Name,
            }));

            if (gamepasses.length > 0) {
                return res.json({ gamepasses });
            } else {
                return res.status(404).json({ error: "No gamepasses found" });
            }
        } else {
            return res.status(404).json({ error: "No assets found" });
        }
    } catch (error) {
        console.error("Error fetching gamepasses:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
