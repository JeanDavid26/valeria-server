export interface Profile {
  id: string;
  userId: string;
  avatar: string | null;
  username: string;
  tag: string;
  description: string | null;
  level: number;
}
