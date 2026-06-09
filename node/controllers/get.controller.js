import { getService } from "../services/get.service.js";

// Xu ly request lay data theo key
export const getController = async (req, res) => {
  try {
    const data = await getService(req.params.key, req.nodeId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};