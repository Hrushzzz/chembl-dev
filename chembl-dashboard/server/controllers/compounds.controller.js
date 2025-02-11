import pool from "../db.js";

// Advanced Search with Filters
export const searchCompounds = async (req, res) => {
    const { query, minWeight, maxWeight, logp, hbd, hba, psa, rtb, maxPhase, moleculeType } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        let sqlQuery = `
            SELECT md.chembl_id, md.pref_name, md.max_phase, 
                   cs.canonical_smiles, cp.full_mwt, cp.alogp, 
                   cp.hbd, cp.hba, cp.psa, cp.rtb,
                   md.molecule_type
            FROM molecule_dictionary md
            LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
            LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
            WHERE (md.chembl_id ILIKE $1 OR md.pref_name ILIKE $1)
        `;

        let values = [`%${query}%`];

        // Apply Filters Dynamically
        if (minWeight) { sqlQuery += ` AND cp.full_mwt >= $${values.length + 1}`; values.push(minWeight); }
        if (maxWeight) { sqlQuery += ` AND cp.full_mwt <= $${values.length + 1}`; values.push(maxWeight); }
        if (logp) { sqlQuery += ` AND cp.alogp = $${values.length + 1}`; values.push(logp); }
        if (hbd) { sqlQuery += ` AND cp.hbd = $${values.length + 1}`; values.push(hbd); }
        if (hba) { sqlQuery += ` AND cp.hba = $${values.length + 1}`; values.push(hba); }
        if (psa) { sqlQuery += ` AND cp.psa = $${values.length + 1}`; values.push(psa); }
        if (rtb) { sqlQuery += ` AND cp.rtb = $${values.length + 1}`; values.push(rtb); }
        if (maxPhase) { sqlQuery += ` AND md.max_phase = $${values.length + 1}`; values.push(maxPhase); }
        if (moleculeType) { sqlQuery += ` AND md.molecule_type ILIKE $${values.length + 1}`; values.push(`%${moleculeType}%`); }

        sqlQuery += ` ORDER BY md.chembl_id LIMIT 50`; // Default ordering and pagination

        console.log("Executing Query:", sqlQuery, values);
        const results = await pool.query(sqlQuery, values);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "No compounds found" });
        }

        res.json(results.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch Compound Details by ChEMBL ID
export const getCompoundById = async (req, res) => {
    const { chemblId } = req.params;

    try {
        const sqlQuery = `
            SELECT md.chembl_id, md.pref_name, md.max_phase, 
                   cs.canonical_smiles, cp.full_mwt, cp.alogp, 
                   cp.hbd, cp.hba, cp.psa, cp.rtb, 
                   md.molecule_type
            FROM molecule_dictionary md
            LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
            LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
            WHERE md.chembl_id = $1
        `;

        const results = await pool.query(sqlQuery, [chemblId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "Compound not found" });
        }

        res.json(results.rows[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Fetch compound details including molecular structure & properties
export const getCompoundDetails = async (req, res) => {
    const { chemblId } = req.params;
  
    try {
      console.log(`🔍 Fetching details for ChEMBL ID: ${chemblId}`);
  
      // First, check if the compound exists in molecule_dictionary
      const checkQuery = `SELECT molregno FROM molecule_dictionary WHERE chembl_id = $1`;
      const checkResult = await pool.query(checkQuery, [chemblId]);
  
      if (checkResult.rows.length === 0) {
        console.warn(`⚠️ Compound not found: ${chemblId}`);
        return res.status(404).json({ message: "Compound not found" });
      }
  
      const molregno = checkResult.rows[0].molregno;
  
      // Main Query: Fetch compound details
      const query = `
        SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, md.first_approval, 
               cs.canonical_smiles, cp.full_mwt, cp.alogp, cp.hbd, cp.hba, cp.psa, cp.rtb
        FROM molecule_dictionary md
        LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
        LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
        WHERE md.molregno = $1
      `;
  
      const result = await pool.query(query, [molregno]);
  
      console.log("✅ Query result:", result.rows);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Compound details not found" });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("❌ Error fetching compound details:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

export const getChartData = async (req, res) => {
    try {
      console.log("🔥 API Called: /chart-data");
      console.log("🛠 Filters Received:", req.body);  // ✅ Log received request
  
      const {
        molecularWeightRange = [100, 500],   // Default values
        logPRange = [-5, 5],
        clinicalPhase = 3,
        hbd = 2,
        hba = 5,
        moleculeType = "Small molecule",
        psaRange = [20, 150],
      } = req.body || {}; // Ensure req.body is not null
  
      if (!Array.isArray(molecularWeightRange) || molecularWeightRange.length !== 2) {
        return res.status(400).json({ error: "Invalid molecularWeightRange format" });
      }
      if (!Array.isArray(logPRange) || logPRange.length !== 2) {
        return res.status(400).json({ error: "Invalid logPRange format" });
      }
      if (!Array.isArray(psaRange) || psaRange.length !== 2) {
        return res.status(400).json({ error: "Invalid psaRange format" });
      }
  
      const sql = `
        SELECT molecule_dictionary.molecule_type, COUNT(*) as count
        FROM molecule_dictionary
        JOIN compound_properties ON molecule_dictionary.molregno = compound_properties.molregno
        WHERE compound_properties.full_mwt BETWEEN $1 AND $2
          AND compound_properties.alogp BETWEEN $3 AND $4
          AND molecule_dictionary.max_phase = $5
          AND compound_properties.hbd = $6
          AND compound_properties.hba = $7
          AND molecule_dictionary.molecule_type = $8
          AND compound_properties.psa BETWEEN $9 AND $10
        GROUP BY molecule_dictionary.molecule_type;
      `;
  
      const params = [
        molecularWeightRange[0], molecularWeightRange[1],
        logPRange[0], logPRange[1],
        clinicalPhase, hbd, hba,
        moleculeType, psaRange[0], psaRange[1]
      ];
  
      console.log("📡 SQL Query Executing:", sql);
      console.log("🗂️ Query Parameters:", params);
  
      const results = await pool.query(sql, params);
  
      console.log("✅ SQL Query Results:", results.rows);
  
      if (!results.rows || results.rows.length === 0) {
        return res.status(200).json([]); // Ensure JSON response
      }
  
      res.json(results.rows);
    } catch (error) {
      console.error("❌ Error in getChartData:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  