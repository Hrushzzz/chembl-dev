import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import compoundRoutes from "./routes/compounds.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", compoundRoutes);

app.get("/compounds", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM molecule_synonyms");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("ChEMBL Compound API is running...");
});

//  Search API
app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const searchQuery = `
      SELECT md.chembl_id, md.pref_name, md.max_phase, 
             cs.canonical_smiles, cp.full_mwt, cp.alogp, 
             cp.hbd, cp.hba, cp.psa, cp.rtb, cp.tpsa
      FROM molecule_dictionary md
      LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
      LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
      WHERE 
        md.chembl_id ILIKE $1 OR 
        md.pref_name ILIKE $2;
    `;

    const results = await pool.query(searchQuery, [`%${query}%`, `%${query}%`]);

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "No compounds found" });
    }

    res.json(results.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
