import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db/db.config.js";

import addShop from "./controllers/addShop.js";
import addProduct from "./controllers/addProduct.js";
import updateProduct from "./controllers/updateProduct.js";
import deleteProduct from "./controllers/deleteProduct.js";
import deleteShop from "./controllers/deleteShop.js";
import auth from "./controllers/auth.js";
import search from "./controllers/search.js";
import addLog from "./controllers/addLog.js";
import getLogs from "./controllers/getLogs.js";
import initializeDB from "./db/initializeDB.js";

var app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

try {
  await db.authenticate();
  await initializeDB();
  console.log("Database connected...");
} catch (error) {
  console.error("Connection error:", error);
}

// Logs
app.get("/api/logs", getLogs);
app.post("/api/logs", addLog);

// Shops
app.post("/api/shops", addShop);
app.delete("/api/shops", deleteShop);

// Products
app.post("/api/products", addProduct);
app.put("/api/products", updateProduct);
app.delete("/api/products", deleteProduct);

// Authentication
app.post("/api/auth", auth);

// Search for shops or products
app.post("/api/search", search);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
