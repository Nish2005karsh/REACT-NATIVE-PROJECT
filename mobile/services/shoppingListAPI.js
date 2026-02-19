import { API_URL } from "../constants/api";

export const ShoppingListAPI = {
    // get all items for a user
    getItems: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/shopping-list/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch shopping list");
            return await response.json();
        } catch (error) {
            console.error("Error fetching shopping list:", error);
            return [];
        }
    },

    // add item to list
    addItem: async (userId, ingredient) => {
        try {
            const response = await fetch(`${API_URL}/shopping-list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, ingredient }),
            });
            if (!response.ok) throw new Error("Failed to add item");
            return await response.json();
        } catch (error) {
            console.error("Error adding shopping list item:", error);
            throw error;
        }
    },

    // toggle item checked status
    toggleItem: async (id, isChecked) => {
        try {
            const response = await fetch(`${API_URL}/shopping-list/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isChecked: isChecked ? 1 : 0 }),
            });
            if (!response.ok) throw new Error("Failed to update item");
            return true;
        } catch (error) {
            console.error("Error updating shopping list item:", error);
            throw error;
        }
    },

    // delete item
    deleteItem: async (id) => {
        try {
            const response = await fetch(`${API_URL}/shopping-list/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete item");
            return true;
        } catch (error) {
            console.error("Error deleting shopping list item:", error);
            throw error;
        }
    },
};
