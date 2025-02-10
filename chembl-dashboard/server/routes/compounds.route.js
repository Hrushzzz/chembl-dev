import express from "express";

const router = express.Router();

router.post("/dashboard", getAllCompoundsData);

export default router;