export interface Profile {
  id: number;
  full_name: string;
  bio: string;
  city: string;
  age: number;
  gender: string;
  date_of_birth: string | null;
  relationship_intent: string;
  education: string;
  career: string;
  values: string;
  hobbies: string;
  preferences: string;
  religion?: number | null;
  religion_name?: string;
  caste?: number | null;
  caste_name?: string;
  gotra?: number | null;
  gotra_name?: string;
  ethnicity: string;
  gan: string;
  horoscope: string;
  profile_image: string | null;
  profile_image_url: string | null;
  is_complete: boolean;
  is_profile_public: boolean;
  verified: boolean;
  compatibility_tags?: string[];
}

export interface DiscoverResponse {
  results: Profile[];
}

export interface MatchResponse {
  message: string;
  matched: boolean;
  match_id?: number;
}
