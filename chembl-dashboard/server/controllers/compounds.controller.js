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
