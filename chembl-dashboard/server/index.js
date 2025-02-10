//const express = require("http");  
import express from "express";
import cors from "cors";
// import compoundRoutes from "./routes/compounds.js";
// import connectToDB from "./database/chemblDB.js";
// import db from "./db.js";
// const pool = require("./db");
import pool from "./db.js"

// creating an Express server
const app = express();
app.use(cors());
app.use(express.json());

app.get("/compounds", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM molecule_synonyms");
      res.json(result.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

// // API's :::
// app.use("/api/compounds", compoundRoutes);

// app.all("*", (req, res) => {
//     res.status(404).send("Page Not Found..!");
// })

// app.listen(5010, () => {
//     console.log("Server is running on port 5010");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));