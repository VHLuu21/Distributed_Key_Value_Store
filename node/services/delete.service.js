import axios from "axios";
import { nodes, REPLICATION_FACTOR } from "../../config.js";
import { getOwnerNode } from "../cluster.js";
import storage from "../storage.js";

// Xu ly logic xoa data owner + relicate
export const deleteService = async (key, nodeId, isInternal = false) => {
  // Xac dinh owner node cua key
  const ownerNodeId = getOwnerNode(key);

  // Request tu replication (noi bo)
  if (isInternal) {
    const isDeleted = storage.del(key);
    if (!isDeleted) throw new Error("Key not found");
    return { message: "Replica deleted" };
  }

  // Node hien tai la owner
  if (ownerNodeId === nodeId) {
    const isDeleted = storage.del(key);
    if (!isDeleted) throw new Error("Key not found");

    for (let i = 1; i < REPLICATION_FACTOR; i++) {
      const replicaNodeId = (ownerNodeId + i) % nodes.length;

      try {
        await axios.delete(`${nodes[replicaNodeId].url}/delete/${key}`, {
          headers: { "x-internal": "true" } // Danh dau request noi bo
        });
      } catch {
        continue;
      }
    }

    return { message: "Deleted from owner + replicas" };
  }

  // Node khong phai la owner, lam coordinator chuyen request
  try {
    // Thu forward toi owner truoc
    const response = await axios.delete(`${nodes[ownerNodeId].url}/delete/${key}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error === "Key not found") {
      throw new Error("Key not found");
    }

    // Neu owner chet, thu xoa tu cac replicas
    let deletedAny = false;
    for (let i = 1; i < REPLICATION_FACTOR; i++) {
      const replicaNodeId = (ownerNodeId + i) % nodes.length;
      try {
        await axios.delete(`${nodes[replicaNodeId].url}/delete/${key}`, {
          headers: { "x-internal": "true" }
        });
        deletedAny = true;
      } catch (replicaErr) {
        if (replicaErr.response && replicaErr.response.data && replicaErr.response.data.error === "Key not found") {
          throw new Error("Key not found");
        }
        continue;
      }
    }

    if (!deletedAny) {
      throw new Error("All replicas failed");
    }
    return { message: "Deleted from replicas (Owner down)" };
  }
};