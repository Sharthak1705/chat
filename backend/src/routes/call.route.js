import express from "express";
import {
  logCall,
  logAudioCall,
  getCallHistory,
} from "../controllers/call.controller.js";

const router = express.Router();

router.post("/log", logCall);
router.post("/log/audio", logAudioCall);
router.get("/history/:userId", getCallHistory);

export default router;
