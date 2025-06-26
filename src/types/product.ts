export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  demographics?: {
    gender?: string;
    age?: string;
    activity?: string;
  };
  votes: {
    up: number;
    down: number;
  };
  images?: string[];
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductFeature {
  icon: React.ReactNode;
  text: string;
}
