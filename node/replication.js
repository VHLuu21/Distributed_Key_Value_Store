import axios from "axios";
import { nodes } from "../config.js";

// Replicate data sang node khac
export default async function replicate(key, value, nodeId) {
  try {
    
    // Gui request sang node dich
    await axios.post(`${nodes[nodeId].url}/replicate`, {
      key,
      value
    }, { timeout: 1000 });

    console.log("Replicated to node", nodeId);
    return true;
  } catch (err) {
    console.log("Replication failed to node", nodeId);
    return false;
  }
}