import express from "express";
import { searchCompounds, getCompoundById } from "../controllers/compounds.controller.js";
import { getCompoundDetails } from "../controllers/compounds.controller.js";
import { getChartData } from "../controllers/compounds.controller.js";

const router = express.Router();

// Advanced Search API with filters
router.get("/search", searchCompounds);

// Get compound details by ChEMBL ID
router.get("/compound/:chemblId", getCompoundById);

// Get full compound details (including structure & properties)
router.get("/compound/details/:chemblId", getCompoundDetails);

router.post("/chart-data", getChartData);

export default router;
