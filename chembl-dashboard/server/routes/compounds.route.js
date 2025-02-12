import express from "express";
import { searchCompounds, getCompoundById } from "../controllers/compounds.controller.js";
import { getCompoundDetails } from "../controllers/compounds.controller.js";
import { getChartData } from "../controllers/compounds.controller.js";

const router = express.Router();

router.get("/search", searchCompounds);

router.get("/compound/:chemblId", getCompoundById);

router.get("/compound/details/:chemblId", getCompoundDetails);

router.post("/chart-data", getChartData);

export default router;
