import { View, Text, Alert, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";
import { MealAPI } from "../../services/mealAPI";
import { ShoppingListAPI } from "../../services/shoppingListAPI";
import { ReviewsAPI } from "../../services/reviewsAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Image } from "expo-image";

import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${userId}`);
        const favorites = await response.json();
        const isRecipeSaved = favorites.some((fav) => fav.recipeId === parseInt(recipeId));
        setIsSaved(isRecipeSaved);
      } catch (error) {
        console.error("Error checking if recipe is saved:", error);
      }
    };

    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const mealData = await MealAPI.getMealById(recipeId);
        if (mealData) {
          const transformedRecipe = MealAPI.transformMealData(mealData);

          const recipeWithVideo = {
            ...transformedRecipe,
            youtubeUrl: mealData.strYoutube || null,
          };

          setRecipe(recipeWithVideo);
        }
      } catch (error) {
        console.error("Error loading recipe detail:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadReviews = async () => {
      try {
        const data = await ReviewsAPI.getReviewsByRecipe(recipeId);
        setReviews(data);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    checkIfSaved();
    loadRecipeDetail();
    loadReviews();
  }, [recipeId, userId]);

  const getYouTubeEmbedUrl = (url) => {
    // example url: https://www.youtube.com/watch?v=mTvlmY4vCug
    const videoId = url ? url.split("v=")[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleToggleSave = async () => {
    setIsSaving(true);

    try {
      if (isSaved) {
        // remove from favorites
        const response = await fetch(`${API_URL}/favorites/${userId}/${recipeId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove recipe");

        setIsSaved(false);
      } else {
        // add to favorites
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            recipeId: parseInt(recipeId),
            title: recipe.title,
            image: recipe.image,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
          }),
        });

        if (!response.ok) throw new Error("Failed to save recipe");
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling recipe save:", error);
      Alert.alert("Error", `Something went wrong. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToShoppingList = async (ingredient) => {
    try {
      await ShoppingListAPI.addItem(userId, ingredient);
      Alert.alert("Success", "Added to shopping list");
    } catch (error) {
      Alert.alert("Error", "Failed to add item");
    }
  };

  const handleAddReview = async () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment");
      return;
    }

    try {
      await ReviewsAPI.addReview({
        userId,
        userName: user.fullName || "Anonymous",
        userAvatar: user.imageUrl,
        recipeId: parseInt(recipeId),
        rating,
        comment,
      });

      setComment("");
      setRating(5);
      setShowReviewModal(false);

      // reload reviews
      const data = await ReviewsAPI.getReviewsByRecipe(recipeId);
      setReviews(data);

      Alert.alert("Success", "Review added!");
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("Error", "Failed to add review");
    }
  };

  if (loading || !recipe) return <LoadingSpinner message="Loading recipe details..." />;

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>{recipe.category}</Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>{recipe.area} Cuisine</Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.servings}</Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {recipe.youtubeUrl && getYouTubeEmbedUrl(recipe.youtubeUrl) && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>

                <Text style={recipeDetailStyles.sectionTitle}>Video Tutorial</Text>
              </View>

              <View style={recipeDetailStyles.videoCard}>
                <WebView
                  style={recipeDetailStyles.webview}
                  source={{ uri: getYouTubeEmbedUrl(recipe.youtubeUrl) }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </View>
          )}

          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.ingredients.length}</Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>{ingredient}</Text>

                  <TouchableOpacity
                    onPress={() => handleAddToShoppingList(ingredient)}
                    hitSlop={10}
                  >
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.instructions.length}</Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>{index + 1}</Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>{instruction}</Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>Step {index + 1}</Text>
                      <TouchableOpacity style={recipeDetailStyles.completeButton}>
                        <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* REVIEWS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#FF9800", "#F57C00"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="star" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Reviews ({reviews.length})</Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 12,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 16
              }}
              onPress={() => setShowReviewModal(true)}
            >
              <Text style={{ color: COLORS.white, fontWeight: "bold" }}>Write a Review</Text>
            </TouchableOpacity>

            {reviews.map((review) => (
              <View key={review.id} style={{
                backgroundColor: COLORS.card,
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                gap: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
              }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {review.userAvatar && (
                      <Image source={{ uri: review.userAvatar }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                    )}
                    <Text style={{ fontWeight: "bold", color: COLORS.text }}>{review.userName || "User"}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: COLORS.textLight }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 2 }}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rating ? "star" : "star-outline"}
                      size={14}
                      color="#FFD700"
                    />
                  ))}
                </View>

                <Text style={{ color: COLORS.text, lineHeight: 20 }}>{review.comment}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[recipeDetailStyles.primaryButton, { marginBottom: 40 }]}
            onPress={handleToggleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons name="heart" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* REVIEW MODAL */}
      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: 20, textAlign: "center" }}>Write a Review</Text>

              <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={32}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 12,
                  padding: 12,
                  height: 100,
                  textAlignVertical: "top",
                  marginBottom: 20,
                  fontSize: 16
                }}
                placeholder="Share your thoughts about this recipe..."
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  style={{ flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" }}
                  onPress={() => setShowReviewModal(false)}
                >
                  <Text style={{ fontWeight: "bold", color: COLORS.text }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, padding: 16, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center" }}
                  onPress={handleAddReview}
                >
                  <Text style={{ fontWeight: "bold", color: COLORS.white }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default RecipeDetailScreen;
