// 🔹 Profile Core
export interface Profile {
  id: number;
  bio: string;
  location: string;
  profile_image: string | null;
}

// 🔹 Stats
export interface ProfileStats {
  followers: number;
  following: number;
  posts: number;
}

// 🔹 Settings
export interface ProfileSettings {
  is_private: boolean;
  blur: boolean;
}

// 🔹 Full API Response
export interface ProfileResponse {
  profile: Profile;
  stats: ProfileStats;
  settings: ProfileSettings;
  is_private: boolean;
}