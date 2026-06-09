import axios from "axios";
import { nodes } from "../config.js";

//Luu trang thai cac node
const alive = new Array(nodes.length).fill(true);

// Theo doi trang thai cac node trong he thong
export function startHeartbeat(selfId) {
  setInterval(async () => {
    for (let node of nodes) {
      if (node.id === selfId) continue;

      try {
        await axios.get(`${node.url}/ping`, { timeout: 1000 });

        // neu truoc do chet gio song lai -> ghi log
        if (!alive[node.id]) {
          console.log(`Node ${node.id} is BACK`);
        }

        alive[node.id] = true;
      } catch {
        // neu truoc do song gio chet -> ghi log
        if (alive[node.id]) {
          console.log(`Node ${node.id} is DOWN`);
        }

        alive[node.id] = false;
      }
    }
  }, 3000);
}