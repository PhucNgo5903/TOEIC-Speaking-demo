import express from "express";
import { getAllSubmissions, createSubmission, deleteSubmission } from "../controllers/submissionController.js";

const router = express.Router();

router.get("/", getAllSubmissions);
router.post("/", createSubmission);
router.delete("/:id", deleteSubmission);

export default router;