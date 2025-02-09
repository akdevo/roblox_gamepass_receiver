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
    const { userId, pageNumber = 1 } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }

    const url = `https://www.roblox.com/users/inventory/list-json?assetTypeId=34&cursor=&itemsPerPage=100&pageNumber=${pageNumber}&userId=${userId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });

        if (response.data && response.data.Data && response.data.Data.Items) {
            const gamepasses = response.data.Data.Items.map((item) => ({
                id: item.Item.AssetId,
                price: item.Product?.PriceInRobux || 0,
            }));

            return res.json({ gamepasses });
        } else {
            return res.status(404).json({ error: "No gamepasses found" });
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
