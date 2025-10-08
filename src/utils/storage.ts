import { SurveyResponse, Rating } from '../types';

const STORAGE_KEY = 'logo-survey-responses';

export const saveResponse = (response: SurveyResponse): void => {
  const existingResponses = getResponses();
  const updatedResponses = [...existingResponses, response];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResponses));
};

export const getResponses = (): SurveyResponse[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const responses = JSON.parse(stored);
    return responses.map((response: any) => ({
      ...response,
      demographics: response.demographics || { gender: '不明', age: 0 },
      completedAt: new Date(response.completedAt),
      ratings: response.ratings.map((rating: any) => ({
        ...rating,
        timestamp: new Date(rating.timestamp)
      }))
    }));
  } catch {
    return [];
  }
};

export const clearAllResponses = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};