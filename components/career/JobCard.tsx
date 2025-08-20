// ---- JobCard ---- //
const JobCard = memo(function JobCard({
  item,
  onPress,
  isSelected,
}: {
  item: JobItem;
  onPress?: (item: JobItem) => void;
  isSelected?: boolean;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSelected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSelected, animatedHeight]);

  const getCardStyle = () => {
    if (isSelected) {
      return styles.cardSelected;
    }
    if (isHovered) {
      return styles.cardHovered;
    }
    if (isPressed) {
      return styles.cardPressed;
    }
    return {};
  };