// Form inputs group
export type InputGroupProps = {
  label: React.ReactNode;
  type: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// RegisterForm Component
export type RegisterFormProps = {
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
};
