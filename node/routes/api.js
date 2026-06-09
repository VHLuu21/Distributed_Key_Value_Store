import express from "express";
import { getController } from "../controllers/get.controller.js";
import { postController } from "../controllers/post.controller.js";
import { deleteController } from "../controllers/delete.controller.js";

const router = express.Router();

router.post("/put", postController);
router.get("/get/:key", getController);
router.delete("/delete/:key", deleteController);

export default router;