import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLOR, RADIUS, SPACE } from "../../constants/design";

export const SkillBadge = memo(function SkillBadge({ skill }: { skill: string }) {
  return (
    <View style={styles.skillBadge}>
      <Text style={styles.skillBadgeText}>{skill}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  skillBadge: {
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
    backgroundColor: "#F0F2FF",
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLOR.primary,
  },
  skillBadgeText: {
    fontSize: 12,
    color: COLOR.primary,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});
