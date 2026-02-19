import Toast from "react-native-toast-message";
import { COLORS } from "../constants/colors";

/**
 * Handles Clerk errors and displays user-friendly toast messages
 * @param {Error} error - The Clerk error object
 */
export const handleClerkError = (error) => {
  // Check if it's a Clerk error
  if (!error || typeof error !== "object") {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "An unexpected error occurred. Please try again.",
      position: "top",
    });
    return;
  }

  // Extract error information - Clerk errors can have errors array or be direct error objects
  const errors = error.errors || (error.clerkError ? [] : [error]);
  const firstError = errors[0] || error;
  const errorCode = firstError.code || "";
  const errorMessage = firstError.message || firstError.longMessage || "An error occurred. Please try again.";

  // Map Clerk error codes to user-friendly messages
  const errorMessages = {
    form_password_incorrect: "Password is incorrect. Please try again.",
    form_identifier_not_found: "No account found with this email address.",
    form_password_pwned: "This password has been found in a data breach. Please choose a different password.",
    form_password_length_too_short: "Password is too short. Please use at least 8 characters.",
    form_password_validation_failed: "Password doesn't meet requirements. Please try again.",
    form_email_address_invalid: "Invalid email address. Please check and try again.",
    form_param_format_invalid: "Invalid format. Please check your input.",
    form_param_nil: "Please fill in all required fields.",
    form_username_invalid: "Invalid username. Please try again.",
    form_password_not_strong_enough: "Password is not strong enough. Please use a stronger password.",
    session_exists: "You are already signed in.",
    unauthorized: "You are not authorized to perform this action.",
    rate_limit_exceeded: "Too many attempts. Please wait a moment and try again.",
  };

  // Get user-friendly message
  const userMessage = errorMessages[errorCode] || errorMessage;

  // Determine toast type based on error severity
  let toastType = "error";
  if (errorCode === "rate_limit_exceeded") {
    toastType = "info";
  }

  // Show toast notification
  Toast.show({
    type: toastType,
    text1: toastType === "error" ? "Error" : "Notice",
    text2: userMessage,
    position: "top",
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

/**
 * Shows a success toast message
 * @param {string} message - Success message to display
 */
export const showSuccessToast = (message) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

/**
 * Shows an error toast message
 * @param {string} message - Error message to display
 */
export const showErrorToast = (message) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "top",
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};

/**
 * Shows an info toast message
 * @param {string} message - Info message to display
 */
export const showInfoToast = (message) => {
  Toast.show({
    type: "info",
    text1: "Info",
    text2: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 40,
  });
};
