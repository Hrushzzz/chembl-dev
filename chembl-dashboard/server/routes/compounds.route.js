import express from "express";
import pool from "../db.js"; // PostgreSQL connection
import cors from 'cors';

const router = express.Router();
router.use(cors());

// Search API
router.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const searchQuery = `
        SELECT md.chembl_id, md.pref_name, md.max_phase, cs.canonical_smiles, cp.full_mwt, cp.alogp, cp.hbd, cp.hba, cp.psa, cp.rtb, cp.tpsa
        FROM molecule_dictionary md
        LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
        LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
        WHERE 
          md.chembl_id ILIKE $1 OR 
          md.pref_name ILIKE $1;
      `;
        
      const results = await pool.query(searchQuery, [`%${query}%`]);
      if (results.rows.length === 0) {
        return res.status(404).json({ message: "No compounds found" });
      }
      res.json(results.rows);
      
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
  export default router;
