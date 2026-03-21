export type User = {
  id: string;
  email: string;
  password: string;
};

export type UserPublic = Omit<User, 'password'>;
