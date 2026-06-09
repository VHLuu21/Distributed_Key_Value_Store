import { deleteService } from "../services/delete.service.js";

// Xu ly request xoa data
export const deleteController = async (req, res) => {
  const key = req.params.key;

  const isInternal = req.headers["x-internal"] === "true";

  try {
    const data = await deleteService(key, req.nodeId, isInternal);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};