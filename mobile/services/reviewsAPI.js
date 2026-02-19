import { API_URL } from "../constants/api";

export const ReviewsAPI = {
    // get reviews for a recipe
    getReviewsByRecipe: async (recipeId) => {
        try {
            const response = await fetch(`${API_URL}/reviews/${recipeId}`);
            if (!response.ok) throw new Error("Failed to fetch reviews");
            return await response.json();
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },

    // get reviews by user
    getReviewsByUser: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/reviews/user/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user reviews");
            return await response.json();
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            return [];
        }
    },

    // add a review
    addReview: async (reviewData) => {
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });
            if (!response.ok) throw new Error("Failed to add review");
            return await response.json();
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    },
};
