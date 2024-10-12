// Register Types
export interface RegisterTypes {
  email: string;
  password: string;
  nickname: string;
}

// Log In Types
export interface LogInTypes {
  email: string;
  password: string;
}

// Auth Context Types
export interface AuthContextTypes {
  loading: boolean;
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}
