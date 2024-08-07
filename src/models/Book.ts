import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import User from "./User";

interface BookAttributes {
  id: number;
  name: string;
  averageRating: number;
  borrowedBy: number | null;
}

interface BookCreationAttributes
  extends Optional<BookAttributes, "id" | "averageRating" | "borrowedBy"> {}

class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: number;
  public name!: string;
  public averageRating!: number;
  public borrowedBy!: number | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: -1,
    },
    borrowedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "books",
  }
);

export default Book;
