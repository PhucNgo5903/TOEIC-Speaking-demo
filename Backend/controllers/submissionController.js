import SpeakingSubmission from "../models/SpeakingSubmission.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await SpeakingSubmission.find()
      .populate("question", "text")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách submissions" });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const { question, transcript, feedback } = req.body;
    const newSubmission = new SpeakingSubmission({ question, transcript, feedback });
    await newSubmission.save();
    res.status(201).json({ message: "Submission saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lưu submission" });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await SpeakingSubmission.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Lỗi xoá submission" });
  }
};
