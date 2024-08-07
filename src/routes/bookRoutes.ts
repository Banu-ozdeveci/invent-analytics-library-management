import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Book from "../models/Book";
import User from "../models/User";

const router = express.Router();

// List Books
router.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll({ attributes: ["id", "name"] });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Book Info
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({
      id: book.id,
      name: book.name,
      score:
        book.averageRating === -1
          ? -1
          : parseFloat(book.averageRating.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Book
router.post(
  "/",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = await Book.create({ name: req.body.name });
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Borrow Book
router.post("/:bookId/borrow", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const book = await Book.findByPk(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.borrowedBy) {
      return res.status(400).json({ error: "Book already borrowed" });
    }

    book.borrowedBy = user.id;
    await book.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Return Book
router.post(
  "/:bookId/return",
  body("score").isInt({ min: 1, max: 10 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByPk(req.body.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const book = await Book.findByPk(req.params.bookId);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.borrowedBy !== user.id) {
        return res
          .status(400)
          .json({ error: "Book was not borrowed by this user" });
      }

      // Update the average rating
      if (book.averageRating === -1) {
        book.averageRating = req.body.score;
      } else {
        book.averageRating = (book.averageRating + req.body.score) / 2;
      }
      book.borrowedBy = null;
      await book.save();

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
