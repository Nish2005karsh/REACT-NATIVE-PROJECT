import cors from "cors";
import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable, shoppingListTable, reviewsTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



// SHOPPING LIST ENDPOINTS

app.post("/api/shopping-list", async (req, res) => {
  try {
    const { userId, ingredient } = req.body;
    if (!userId || !ingredient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newItem = await db
      .insert(shoppingListTable)
      .values({
        userId,
        ingredient,
      })
      .returning();

    res.status(201).json(newItem[0]);
  } catch (error) {
    console.log("Error adding to shopping list", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/shopping-list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await db
      .select()
      .from(shoppingListTable)
      .where(eq(shoppingListTable.userId, userId))
      .orderBy(shoppingListTable.createdAt);

    res.status(200).json(items);
  } catch (error) {
    console.log("Error fetching shopping list", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/api/shopping-list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isChecked } = req.body;

    await db
      .update(shoppingListTable)
      .set({ isChecked })
      .where(eq(shoppingListTable.id, parseInt(id)));

    res.status(200).json({ message: "Item updated" });
  } catch (error) {
    console.log("Error updating shopping list item", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/shopping-list/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(shoppingListTable).where(eq(shoppingListTable.id, parseInt(id)));

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.log("Error deleting shopping list item", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// REVIEWS ENDPOINTS

app.post("/api/reviews", async (req, res) => {
  try {
    const { userId, userName, userAvatar, recipeId, rating, comment } = req.body;
    if (!userId || !recipeId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = await db
      .insert(reviewsTable)
      .values({
        userId,
        userName,
        userAvatar,
        recipeId,
        rating,
        comment,
      })
      .returning();

    res.status(201).json(newReview[0]);
  } catch (error) {
    console.log("Error adding review", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/reviews/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.recipeId, parseInt(recipeId)))
      .orderBy(reviewsTable.createdAt);

    res.status(200).json(reviews);
  } catch (error) {
    console.log("Error fetching reviews", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/reviews/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.userId, userId))
      .orderBy(reviewsTable.createdAt);

    res.status(200).json(reviews);
  } catch (error) {
    console.log("Error fetching user reviews", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
