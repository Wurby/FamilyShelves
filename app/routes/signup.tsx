import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../DB/firebase";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { signup } from "../DB/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-6 p-8 border-2 border-slate-500 rounded-md ">
          <div className="flex flex-col gap-2">
            <Text variant="subtitle" centered>
              You are signed in as:
            </Text>
            <Text centered className="font-medium">
              {user.displayName || user.email}
            </Text>
          </div>

          <div className="flex flex-col gap-6">
            <Link to="/app">
              <Button variant="solid" className="w-full">
                Launch App
              </Button>
            </Link>

            <Text variant="caption" centered muted>
              If you'd like to logout or switch accounts,{" "}
              <Link to="/logout">
                <Text variant="link">click here</Text>
              </Link>
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Name validation - trim whitespace and check length
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Email validation - trim and convert to lowercase
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation - more specific error messages
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[@$!%*?&]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        errors.password =
          "Password must include uppercase & lowercase letters, numbers, and special characters (@$!%*?&)";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      setError("Please fix the validation errors before continuing.");
      return;
    }

    try {
      await signup({ email, password, name });
      navigate("/app");
    } catch (error) {
      if (error instanceof Error) {
        // More user-friendly error messages for common Firebase errors
        const errorMessage = error.message;
        if (errorMessage.includes("auth/email-already-in-use")) {
          setError("An account with this email already exists");
        } else if (errorMessage.includes("auth/invalid-email")) {
          setError("Invalid email address");
        } else if (errorMessage.includes("auth/weak-password")) {
          setError("Password is too weak");
        } else {
          setError(errorMessage);
        }
      } else {
        setError("Failed to create account");
      }
      console.error(error);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-2 items-center justify-start h-screen pt-[20vh] md:justify-center md:pt-0">
        <Text variant="title">Sign up to get started</Text>
        <form
          className="flex flex-col gap-2 p-4 border-2 border-slate-500 rounded-md w-[340px] "
          onSubmit={handleSignup}
        >
          <label className="flex flex-col gap-2 justify-center items-center">
            <Text variant="caption">Name</Text>
            <input
              className={`p-2 border-2 ${
                validationErrors.name ? "border-red-500" : "border-slate-500"
              } rounded-md w-64`}
              type="text"
              value={name}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              autoComplete="name"
            />
            <Text variant="caption" className="text-red-500">
              {validationErrors.name || "\u00A0"}
            </Text>
          </label>

          <label className="flex flex-col gap-2 justify-center items-center">
            <Text variant="caption">Email</Text>
            <input
              className={`p-2 border-2 ${
                validationErrors.email ? "border-red-500" : "border-slate-500"
              } rounded-md w-64`}
              type="email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Email"
              required
            />
            <Text variant="caption" className="text-red-500">
              {validationErrors.email || "\u00A0"}
            </Text>
          </label>

          <label className="flex flex-col gap-2 justify-center items-center">
            <Text variant="caption">Password</Text>
            <input
              className={`p-2 border-2 ${
                validationErrors.password
                  ? "border-red-500"
                  : "border-slate-500"
              } rounded-md w-64`}
              type="password"
              value={password}
              id="password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={8}
            />
            <Text variant="caption" className="text-red-500">
              {validationErrors.password || "\u00A0"}
            </Text>
          </label>

          <div>
            {error && (
              <Text variant="caption" className="text-red-500">
                {error}
              </Text>
            )}
          </div>

          <Button variant="solid" type="submit">
            Sign Up
          </Button>

          <Text muted>
            Already have an account?{" "}
            <Button variant="link" to="/login">
              Log in
            </Button>
          </Text>
        </form>
      </section>
    </>
  );
}
