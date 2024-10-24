import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../app/register/page";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

jest.mock("../hooks/useAuth");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Register Component", () => {
  const mockedUseAuth = useAuth;

  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ isLoggedIn: false, loading: false });
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  // Render correctly
  test("renders registration form", () => {
    render(<Register />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  // Input values
  test("updates input values correctly", () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nickname/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText(/Email/i).value).toBe(
      "test@example.com"
    );
    expect(screen.getByPlaceholderText(/Nickname/i).value).toBe("TestUser");
    expect(screen.getByTestId("password").value).toBe("password123");
    expect(screen.getByTestId("confirmPassword").value).toBe("password123");
  });

  // Display error message for duplicate email
  test("displays error message for duplicate email", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 400,
        json: () => Promise.resolve({ message: "Email already exists!" }),
      })
    );

    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "duplicate@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nickname/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Start Coding Now/i));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });

  // Register successfully
  test("successfully registers a user", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Registration successful!" }),
      })
    );

    const { container } = render(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nickname/i), {
      target: { value: "NewUser" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Start Coding Now/i));

    await waitFor(() => {
      expect(screen.getByText(/Registered Successfully/i)).toBeInTheDocument();
    });
  });

  // Display error message for mismatch password
  test("displays password mismatch error", async () => {
    render(<Register />);
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "password123444" },
    });

    // Wait for the mismatch error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});
