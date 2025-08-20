export type JobItem = {
  id: string | number;
  title: string;
  category?: string;
  description: string;
  iconEmoji?: string;
  iconUri?: string;
  skills?: string[];
  expectedSalary?: string;
};

export type CareerRecommendationsProps = {
  userName?: string;
  items: JobItem[];
  onPressItem?: (item: JobItem) => void;
  onBack?: () => void;
};
