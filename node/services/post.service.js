import axios from "axios";
import { nodes, REPLICATION_FACTOR } from "../../config.js";
import { getOwnerNode } from "../cluster.js";
import storage from "../storage.js";
import replicate from "../replication.js";

// Xu ly logic luu data
export const postService = async (body, nodeId) => {
  const { key, value } = body;
  // Xac dinh node gan key
  const ownerNodeId = getOwnerNode(key);

  // Node hien tai la owner
  if (ownerNodeId === nodeId) {
    storage.put(key, value);

    // Replicate data sang node khac
    for (let i = 1; i < REPLICATION_FACTOR; i++) {
      const replicaNodeId = (ownerNodeId + i) % nodes.length;
      await replicate(key, value, replicaNodeId);
    }

    return { message: "Stored at owner node + replica" };
  }

  // Node khong phai la owner, lam coordinator chuyen request
  try {
    // Thu forward request sang owner node
    const response = await axios.post(`${nodes[ownerNodeId].url}/put`, body);
    return response.data;
  } catch (err) {
    // Neu owner chet, thu ghi truc tiep vao cac node replicas (failover)
    let savedAny = false;

    for (let i = 1; i < REPLICATION_FACTOR; i++) {
      const replicaNodeId = (ownerNodeId + i) % nodes.length;

      if (replicaNodeId === nodeId) {
        // Neu node hien tai chinh la replica, luu vao storage cuc bo
        storage.put(key, value);
        savedAny = true;
      } else {
        // Neu khong phai, goi API replicate sang node do
        const success = await replicate(key, value, replicaNodeId);
        if (success) savedAny = true;
      }
    }

    if (!savedAny) {
      throw new Error("Owner and all replicas are down");
    }

    return { message: "Stored at replicas (Owner down)" };
  }
};