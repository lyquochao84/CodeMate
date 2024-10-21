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

// Recommendation Lists
export interface RecommendationListsTypes {
  list: string;
  description: string;
  image: string;
}

// General Lists
export interface GeneralListsTypes {
  name: string;
  type: string;
  image: string;
}

// Example type for each object in the examples array
interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

// Problems interface
export interface ProblemsTypes {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  company: string[];
  lists: string[];
  examples: ProblemExample[];
}
