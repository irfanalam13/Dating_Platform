export interface ProfileImage {
  id: number;
  image: string;
}

export interface Profile {
  bio: string;
  age: number;
  images: ProfileImage[];
}