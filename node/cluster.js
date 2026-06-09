import { nodes } from "../config.js";

// Hash key de phan phoi du lieu vao cac node
function hash(key) {
   let h = 0;
   for (let i = 0; i < key.length; i++) {
      h = (h * 31 + key.charCodeAt(i)) >>> 0;
   }
   return h;
}
// Xac dinh node gan key
export function getOwnerNode(key) {
   return hash(key) % nodes.length;
}
