import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shoppingListTable = pgTable("shopping_list", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  ingredient: text("ingredient").notNull(),
  isChecked: integer("is_checked").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name"),
  userAvatar: text("user_avatar"),
  recipeId: integer("recipe_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
