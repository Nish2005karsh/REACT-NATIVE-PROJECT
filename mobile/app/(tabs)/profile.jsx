import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useEffect, useState } from "react";
import { ReviewsAPI } from "../../services/reviewsAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from "expo-router";

const ProfileScreen = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserReviews();
        }
    }, [user]);

    const loadUserReviews = async () => {
        try {
            const data = await ReviewsAPI.getReviewsByUser(user.id);
            setReviews(data);
        } catch (error) {
            console.error("Error loading user reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    if (!isLoaded) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
                <Text style={styles.name}>{user?.fullName || "User"}</Text>
                <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error || "#FF4444"} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{reviews.length}</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}</Text>
                    <Text style={styles.statLabel}>Member Since</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Your Reviews</Text>

                {loading ? (
                    <LoadingSpinner />
                ) : reviews.length > 0 ? (
                    <FlatList
                        data={reviews}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Ionicons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.reviewComment}>{item.comment}</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="create-outline" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>You haven't successfully reviewed any recipes yet.</Text>
                    </View>
                )}
            </View>
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
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    signOutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFEEEE",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    signOutText: {
        color: "#FF4444",
        fontWeight: "600",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    divider: {
        width: 1,
        backgroundColor: COLORS.border,
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    reviewCard: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontWeight: "bold",
        color: COLORS.text,
    },
    reviewComment: {
        color: COLORS.text,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },
    emptyText: {
        color: COLORS.textLight,
        marginTop: 12,
        textAlign: "center",
    },
});

export default ProfileScreen;
