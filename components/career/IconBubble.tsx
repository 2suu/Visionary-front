import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RADIUS, SPACE } from "../../constants/design";

export const IconBubble = memo(function IconBubble({
  iconEmoji,
  iconUri,
}: {
  iconEmoji?: string;
  iconUri?: string;
}) {
  return (
    <View style={styles.iconBubble}>
      {iconUri ? (
        <Image
          source={{ uri: iconUri }}
          style={styles.iconImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.iconEmoji} accessibilityLabel={iconEmoji || "아이콘"}>
          {iconEmoji || "💼"}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACE.md,
  },
  iconEmoji: { 
    fontSize: 24 
  },
  iconImage: { 
    width: "65%", 
    height: "65%" 
  },
});
