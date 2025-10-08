export interface Logo {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Rating {
  id: string;
  logoId: string;
  rating: number;
  timestamp: Date;
}

export interface SurveyResponse {
  id: string;
  demographics: {
    gender: string;
    age: number;
  };
  ratings: Rating[];
  completedAt: Date;
}

export interface LogoStats {
  logoId: string;
  logoName: string;
  averageRating: number;
  totalRatings: number;
}