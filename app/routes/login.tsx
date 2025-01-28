import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../DB/firebase";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { login } from "../DB/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const validateForm = () => {
    setError("");
    setValidationErrors({});
    const errors: { email?: string; password?: string } = {};
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate password
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await login(email, password);
      navigate("/app");
    } catch (error) {
      setError("Failed to log in");
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col gap-2 items-center justify-start h-screen pt-[20vh] md:justify-center md:pt-0">
      <Text variant="title">Welcome back</Text>
      <form
        className="flex flex-col gap-4 p-4 border-2 border-slate-500 rounded-md "
        onSubmit={handleLogin}
      >
        <label className="flex flex-col gap-2 justify-center items-center">
          <Text variant="caption">Email</Text>
          <input
            className={`p-2 border-2 ${
              validationErrors.email ? "border-red-500" : "border-slate-500"
            } rounded-md w-64`}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
          />
          <span className="text-red-500 text-sm">
            {validationErrors.email || "\u00A0"}
          </span>
        </label>

        <label className="flex flex-col gap-2 justify-center items-center">
          <Text variant="caption">Password</Text>
          <input
            className={`p-2 border-2 ${
              validationErrors.password ? "border-red-500" : "border-slate-500"
            } rounded-md w-64`}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
          />
          <span className="text-red-500 text-sm">
            {validationErrors.password || "\u00A0"}
          </span>
        </label>

        <div className="text-center">
          {error && (
            <Text variant="caption" className="text-red-500">
              {error}
            </Text>
          )}
        </div>

        <Button variant="solid" type="submit">
          Log In
        </Button>

        <Text muted centered>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            Sign up
          </Link>
        </Text>
      </form>
    </section>
  );
}
