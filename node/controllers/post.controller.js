import { postService } from "../services/post.service.js";

// Xu ly request post data
export const postController = async (req, res) => {
  try {
    const data = await postService(req.body, req.nodeId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};