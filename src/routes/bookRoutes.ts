import express from "express";
import { body } from "express-validator";
import {
  listBooks,
  createBook,
  getBookInfo,
  borrowBook,
  returnBook,
} from "../controllers/bookController";

const router = express.Router();

router.get("/", listBooks);
router.post(
  "/",
  body("name").isString().withMessage("Name is required"),
  createBook
);
router.get("/:bookId", getBookInfo);
router.post("/:bookId/borrow", borrowBook);
router.post(
  "/:bookId/return",
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating should be between 0 and 5"),
  returnBook
);

export default router;
