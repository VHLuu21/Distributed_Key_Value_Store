import axios from "axios";
import { nodes, REPLICATION_FACTOR } from "../../config.js";
import { getOwnerNode } from "../cluster.js";
import storage from "../storage.js";

// Xu ly logic doc du lieu theo key
export const getService = async (key, nodeId) => {
  // Xac dinh node so huu key
  const ownerNode = getOwnerNode(key);

  // Node hien tai la owner
  if (ownerNode === nodeId) {
    return { value: storage.get(key) };
  }

  // Neu node hien tai khong phai owner chuyen node khac
  try {
    for(let i = 0;i < REPLICATION_FACTOR;i++){
      const node = (ownerNode + i) % nodes.length;
      try {
        const response = await axios.get(`${nodes[node].url}/get/${key}`);
        return response.data;
      }catch {
        // Neu node hien tai chet -> node tiep theo
        continue;
      }
    }
    throw new Error("All replicas failed");
  } catch {
    throw new Error("Read failed");
  }
};