import mongoose from "mongoose";

const SpeakingSubmissionSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  transcript: { type: String, required: true },

  feedback: {
    grammar: {
      comment: String,
      score: Number,
    },
    contentLogic: {
      comment: String,
      score: Number,
    },
    fluency: {
      comment: String,
      score: Number,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SpeakingSubmission", SpeakingSubmissionSchema);
