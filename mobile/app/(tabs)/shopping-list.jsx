import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { ShoppingListAPI } from "../../services/shoppingListAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { LinearGradient } from "expo-linear-gradient";

const ShoppingListScreen = () => {
    const { user } = useUser();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadItems = async () => {
        try {
            const data = await ShoppingListAPI.getItems(user.id);
            setItems(data);
        } catch (error) {
            console.error("Error loading shopping list:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user) loadItems();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        loadItems();
    };

    const handleToggleItem = async (id, currentStatus) => {
        // optimistic update
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isChecked: !currentStatus } : item))
        );

        try {
            await ShoppingListAPI.toggleItem(id, !currentStatus);
        } catch (error) {
            // revert on error
            setItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, isChecked: currentStatus } : item))
            );
            Alert.alert("Error", "Failed to update item");
        }
    };

    const handleDeleteItem = async (id) => {
        Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: async () => {
                    // optimistic delete
                    const previousItems = [...items];
                    setItems((prev) => prev.filter((item) => item.id !== id));

                    try {
                        await ShoppingListAPI.deleteItem(id);
                    } catch (error) {
                        setItems(previousItems);
                        Alert.alert("Error", "Failed to delete item");
                    }
                },
            },
        ]);
    };

    if (loading && !refreshing) return <LoadingSpinner message="Loading shopping list..." />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping List</Text>
                <Text style={styles.headerSubtitle}>{items.filter((i) => !i.isChecked).length} items to buy</Text>
            </View>

            {items.length > 0 ? (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <TouchableOpacity
                                style={styles.itemContent}
                                onPress={() => handleToggleItem(item.id, item.isChecked === 1)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, item.isChecked === 1 && styles.checkedCheckbox]}>
                                    {item.isChecked === 1 && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                                </View>
                                <Text style={[styles.itemText, item.isChecked === 1 && styles.checkedItemText]}>
                                    {item.ingredient}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDeleteItem(item.id)} hitSlop={10}>
                                <Ionicons name="trash-outline" size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={64} color={COLORS.textLight} />
                    <Text style={styles.emptyTitle}>Your list is empty</Text>
                    <Text style={styles.emptyDescription}>Add ingredients from recipes to get started!</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 5,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    itemCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    itemContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    checkedCheckbox: {
        backgroundColor: COLORS.primary,
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
        flex: 1,
    },
    checkedItemText: {
        color: COLORS.textLight,
        textDecorationLine: "line-through",
    },
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 8,
    },
});

export default ShoppingListScreen;
