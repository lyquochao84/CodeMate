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


// SubmissionResult
export type SubmissionResult = {
  source_code: string;
  language_id: number;
  stdin: string | null;
  expected_output: string | null;
  stdout: string;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  created_at: string; // ISO 8601 timestamp
  finished_at: string; // ISO 8601 timestamp
  time: string; // Execution time in seconds
  wall_time: string; // Wall clock time in seconds
  cpu_time_limit: string;
  memory_limit: number;
  memory: number;
  status: {
    id: number;
    description: string; // e.g., "Accepted", "Runtime Error"
  };
  language: {
    id: number;
    name: string; // e.g., "JavaScript (Node.js 20.17.0)"
  };
  token: string; // Unique identifier for the submission
  additional_files: string | null;
  callback_url: string | null;
  command_line_arguments: string | null;
  cpu_extra_time: string;
  enable_network: boolean;
  enable_per_process_and_thread_memory_limit: boolean;
  enable_per_process_and_thread_time_limit: boolean;
  exit_code: number;
  exit_signal: string | null;
  max_file_size: number;
  max_processes_and_or_threads: number;
  number_of_runs: number;
  post_execution_filesystem: string | null;
  redirect_stderr_to_stdout: boolean;
  stack_limit: number;
  wall_time_limit: string;
};
