import pool from "../db.js";

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

        // Applying Filters Dynamically
        if (minWeight) { sqlQuery += ` AND cp.full_mwt >= $${values.length + 1}`; values.push(minWeight); }
        if (maxWeight) { sqlQuery += ` AND cp.full_mwt <= $${values.length + 1}`; values.push(maxWeight); }
        if (logp) { sqlQuery += ` AND cp.alogp = $${values.length + 1}`; values.push(logp); }
        if (hbd) { sqlQuery += ` AND cp.hbd = $${values.length + 1}`; values.push(hbd); }
        if (hba) { sqlQuery += ` AND cp.hba = $${values.length + 1}`; values.push(hba); }
        if (psa) { sqlQuery += ` AND cp.psa = $${values.length + 1}`; values.push(psa); }
        if (rtb) { sqlQuery += ` AND cp.rtb = $${values.length + 1}`; values.push(rtb); }
        if (maxPhase) { sqlQuery += ` AND md.max_phase = $${values.length + 1}`; values.push(maxPhase); }
        if (moleculeType) { sqlQuery += ` AND md.molecule_type ILIKE $${values.length + 1}`; values.push(`%${moleculeType}%`); }

        sqlQuery += ` ORDER BY md.chembl_id LIMIT 50`;

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

// Fetching Compound Details by ChEMBL ID
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


// Fetching compound details including molecular structure & properties
export const getCompoundDetails = async (req, res) => {
    const { chemblId } = req.params;
  
    try {
      console.log(`Fetching details for ChEMBL ID: ${chemblId}`);
  
      // checking if the compound exists in molecule_dictionary
      const checkQuery = `SELECT molregno FROM molecule_dictionary WHERE chembl_id = $1`;
      const checkResult = await pool.query(checkQuery, [chemblId]);
  
      if (checkResult.rows.length === 0) {
        console.warn(`Compound not found: ${chemblId}`);
        return res.status(404).json({ message: "Compound not found" });
      }
  
      const molregno = checkResult.rows[0].molregno;
  
      // Fetching compound details
      const query = `
        SELECT md.chembl_id, md.pref_name, md.molecule_type, md.max_phase, md.first_approval, 
               cs.canonical_smiles, cp.full_mwt, cp.alogp, cp.hbd, cp.hba, cp.psa, cp.rtb
        FROM molecule_dictionary md
        LEFT JOIN compound_structures cs ON md.molregno = cs.molregno
        LEFT JOIN compound_properties cp ON md.molregno = cp.molregno
        WHERE md.molregno = $1
      `;
  
      const result = await pool.query(query, [molregno]);
  
      console.log("Query result:", result.rows);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Compound details not found" });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching compound details:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

export const getChartData = async (req, res) => {
  try {
    const { molecularWeightRange, logPRange, clinicalPhase, hbd, hba, moleculeType, psaRange } = req.body;
    
    const query = `
      SELECT 
        md.molecule_type,
        cp.full_mwt, 
        cp.alogp, 
        cp.hbd, 
        cp.hba
      FROM molecule_dictionary md
      JOIN compound_properties cp ON md.molregno = cp.molregno
      WHERE 
        cp.full_mwt BETWEEN $1 AND $2
        AND cp.alogp BETWEEN $3 AND $4
        AND md.max_phase = $5
        AND cp.hbd = $6
        AND cp.hba = $7
        AND md.molecule_type = $8
        AND cp.psa BETWEEN $9 AND $10
    `;

    const values = [
      molecularWeightRange[0], molecularWeightRange[1], 
      logPRange[0], logPRange[1], 
      clinicalPhase, 
      hbd, hba, 
      moleculeType, 
      psaRange[0], psaRange[1]
    ];

    const result = await pool.query(query, values);
    const compounds = result.rows;

    if (!compounds.length) {
      return res.json({ message: "No data available for selected filters.", data: [] });
    }

    // Transforming data for different chart types
    const barChartData = compounds.map(comp => ({ label: comp.full_mwt, value: comp.full_mwt }));
    const pieChartData = compounds.reduce((acc, comp) => {
      acc[comp.molecule_type] = (acc[comp.molecule_type] || 0) + 1;
      return acc;
    }, {});
    const histogramData = compounds.map(comp => comp.alogp);
    const scatterPlotData = compounds.map(comp => ({ x: comp.full_mwt, y: comp.alogp }));
    const boxPlotData = {
      hbd: compounds.map(comp => comp.hbd),
      hba: compounds.map(comp => comp.hba),
    };

    return res.json({
      barChartData,
      pieChartData: Object.keys(pieChartData).map(type => ({ label: type, value: pieChartData[type] })),
      histogramData,
      scatterPlotData,
      boxPlotData
    });

  } catch (error) {
    console.error("Error in getChartData:", error);
    return res.status(500).json({ error: "Server error while fetching chart data." });
  }
};
