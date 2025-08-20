import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLOR, RADIUS, SPACE } from "../../constants/design";

export const Badge = memo(function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge} accessibilityRole="text">
      <Text style={styles.badgeText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.sm,
    paddingVertical: 4,
    backgroundColor: "#F0F2FF",
    borderRadius: RADIUS.xs,
    marginBottom: SPACE.xs,
  },
  badgeText: {
    fontSize: 11,
    color: COLOR.primary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});
