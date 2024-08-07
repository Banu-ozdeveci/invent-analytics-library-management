CREATE TABLE sqlite_sequence(name, seq);

CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);

CREATE TABLE `books` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `averageRating` FLOAT DEFAULT '-1',
  `borrowedBy` INTEGER REFERENCES `users` (`id`),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);
