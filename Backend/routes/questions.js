import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);          
router.get("/:id", getQuestionById);      
router.post("/", createQuestion);         
router.put("/:id", updateQuestion);        
router.delete("/:id", deleteQuestion);     

export default router;