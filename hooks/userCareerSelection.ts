import { useState } from "react";
import { JobItem } from "../types/career";

export const useCareerSelection = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);

  const handlePress = (item: JobItem) => {
    if (selectedItemId === item.id) {
      setSelectedItemId(null);
      console.log("Selection cleared");
    } else {
      setSelectedItemId(item.id);
      console.log("Selected:", item.title, "ID:", item.id);
    }
  };

  return {
    selectedItemId,
    handlePress,
    isSelected: (id: string | number) => selectedItemId === id,
  };
};