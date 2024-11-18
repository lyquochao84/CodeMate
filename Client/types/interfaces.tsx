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
  list: string;
  type: string;
  image: string;
}

// Example type for each object in the examples array
interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

// Test Cases
interface TestCase {
  input: Record<string, string>;
  output: string;
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
  testCases: TestCase[];
}

// List details props
export interface ListDetailsProps {
  params: { list: string };
}

// Sorting Modal Props
export interface SortingModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  difficultySelections: { [key: string]: boolean };
  handleDifficultyChange: (difficulty: string) => void;
}

// Problems List Props
export interface ProblemsListProps {
  currentProblems: ProblemsTypes[];
  getDifficultyClass: (difficulty: string) => string;
}

// Pagination Props
export interface PaginationProps {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  totalPages: number;
}

// Problem Details Page Props
export interface ProblemDetailsProps {
  // params: { title: string };
  problemDetails: ProblemsTypes | null;
  submissionResults?: any;
  isSubmissionTriggered?: boolean;
  roomId?: string | null,
  handleGenerateRoomId?: () => void;
  handleCreateRoom?: () => void;
}

// Code Edtior Props
export interface CodeEditorProps {
  language: string;
  initialValue?: string;
  onChange: (value: string | undefined) => void;
}

// Code Editor Header Dropdown
export interface CodeEditorHeaderProps {
  language: string;
  handleChooseLanguage: (selectedLanguage: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCodeSubmission?: () => Promise<void>; 
}

// Code Editor Buttons
export interface CodeEditorButtonsProps {
  handleCodeSubmission?: () => Promise<void>; 
}

// Handle Collaboration Modal Open/Close
export interface CollaborationModalProps {
  onClose: () => void;
  roomId?: string | null,
  handleGenerateRoomId?: () => void;
  handleCreateRoom?: () => void;
}
