import express from "express";
import { nodes } from "../config.js";
import storage from "./storage.js";
import { startHeartbeat } from "./heartbeat.js";
import apiRoutes from "./routes/api.js";
import axios from "axios";

const app = express();
app.use(express.json());

// Cho phep CROS de client HTML co the goi API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const PORT = process.argv[2];

// Tim node tuong ung trong config
const selfNode = nodes.find(n => n.url.includes(`:${PORT}`));

// Bao loi va dung neu khong tim thay
if (!selfNode) {
  console.error("Node not found");
  process.exit(1);
}
const Node_ID = selfNode.id;

// Gan nodeId vao request
app.use((req, res, next) => {
  req.nodeId = Node_ID;
  next();
});

// log request
app.use((req, res, next) => {
  console.log(`[${PORT}] ${req.method} ${req.url}`);
  next();
});

//Gui tin hieu heart beat
startHeartbeat(Node_ID);

// routes chinh
app.use("/", apiRoutes);

// Endpoit replicate data tu node khac de dong bo
app.post("/replicate", (req, res) => {
  const { key, value } = req.body;
  storage.put(key, value);
  res.json({ message: "Replica stored" });
});

// local snapshot cho cac node khac goi den de dong bo
app.get("/local-snapshot", (req, res) => {
  res.json(storage.getAll());
});

// snapshot (coordinator)
app.get("/snapshot", async (req, res) => {
  // Lay data hien tai cua node
  const allData = { ...storage.getAll() };
  
  // Lay tu cac node khac
  const otherNodes = nodes.filter(node => node.id !== Node_ID);
  
  for (const node of otherNodes) {
    try {
      const response = await axios.get(`${node.url}/local-snapshot`);
      Object.assign(allData, response.data);
    } catch (err) {
      console.error(`Loi khi lay snapshot tu node ${node.id}:`, err.message);
    }
  }
  
  res.json(allData);
});

// ping
app.get("/ping", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Node ${Node_ID} running at ${PORT}`);
});