import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import Book from "../models/Book";
import { Op } from "sequelize";

const router = express.Router();

// List Users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name"] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get User Info
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const pastBooks = await Book.findAll({
      where: {
        borrowedBy: user.id,
        averageRating: {
          [Op.gt]: -1,
        },
      },
    });

    const presentBooks = await Book.findAll({
      where: { borrowedBy: user.id, averageRating: -1 },
    });

    res.json({
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks.map((book) => ({
          name: book.name,
          userScore: book.averageRating,
        })),
        present: presentBooks.map((book) => ({
          name: book.name,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create User
router.post(
  "/",
  body("name").isString(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.create({ name: req.body.name });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
