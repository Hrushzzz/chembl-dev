import express from "express";
import { searchCompounds, getCompoundById } from "../controllers/compounds.controller.js";

const router = express.Router();

// Advanced Search API with filters
router.get("/search", searchCompounds);

// Get compound details by ChEMBL ID
router.get("/compound/:chemblId", getCompoundById);

export default router;
