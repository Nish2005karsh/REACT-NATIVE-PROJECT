import { View, Text } from "react-native";
import { COLORS } from "../constants/colors";

/**
 * Custom toast configuration to match app theme
 */
export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderLeftColor: "#4CAF50",
        borderLeftWidth: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View style={{ flex: 1 }}>
        {text1 && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: 2,
            }}
          >
            {text1}
          </Text>
        )}
        {text2 && (
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textLight,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderLeftColor: "#F44336",
        borderLeftWidth: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View style={{ flex: 1 }}>
        {text1 && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: 2,
            }}
          >
            {text1}
          </Text>
        )}
        {text2 && (
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textLight,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderLeftColor: COLORS.primary,
        borderLeftWidth: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: COLORS.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View style={{ flex: 1 }}>
        {text1 && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.text,
              marginBottom: 2,
            }}
          >
            {text1}
          </Text>
        )}
        {text2 && (
          <Text
            style={{
              fontSize: 13,
              color: COLORS.textLight,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
};
