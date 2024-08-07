import express from "express";
import bodyParser from "body-parser";
import sequelize from "./sequelize";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import User from "./models/User";
import Book from "./models/Book";

const app = express();
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

// Sync database
sequelize.sync({ force: true }).then(async () => {
  console.log("Database & tables created!");

  // Create some users
  await User.create({ name: "Alice" });
  await User.create({ name: "Bob" });

  // Create some books
  await Book.create({ name: "1984" });
  await Book.create({ name: "Brave New World" });

  console.log("Initial data added");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
