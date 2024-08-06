import express from "express";
import { body } from "express-validator";
import {
  listUsers,
  createUser,
  getUserInfo,
} from "../controllers/userController";

const router = express.Router();

router.get("/", listUsers);
router.post(
  "/",
  body("name").isString().withMessage("Name is required"),
  createUser
);
router.get("/:userId", getUserInfo);

export default router;
