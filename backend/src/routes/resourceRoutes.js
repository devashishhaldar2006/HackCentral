import express from "express";
import { getResources, getResourceById } from "../controllers/resourceController.js";

const resourceRouter = express.Router();

resourceRouter.get("/", getResources);
resourceRouter.get("/:id", getResourceById);

export default resourceRouter;