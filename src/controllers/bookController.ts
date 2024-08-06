import { Request, Response } from "express";
import Book from "../models/Book";
import User from "../models/User";

export const listBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to list books" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const book = await Book.create({ name });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};

export const getBookInfo = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve book information" });
  }
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const book = await Book.findByPk(req.params.bookId);
    const user = await User.findByPk(userId);
    if (!book || !user) {
      return res.status(404).json({ error: "Book or user not found" });
    }
    // Assume we have a mechanism to track borrowed status
    res.json({ message: `Book borrowed by user ${userId}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to borrow book" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const { userId, rating } = req.body;
    const book = await Book.findByPk(req.params.bookId);
    const user = await User.findByPk(userId);
    if (!book || !user) {
      return res.status(404).json({ error: "Book or user not found" });
    }
    // Calculate and update average rating
    book.averageRating = (book.averageRating + rating) / 2;
    await book.save();
    res.json({
      message: `Book returned by user ${userId} with rating ${rating}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to return book" });
  }
};
