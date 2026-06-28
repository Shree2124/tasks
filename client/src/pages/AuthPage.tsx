import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage, useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    const trimmedEmail = email.trim();

    if (mode === "register" && !name.trim()) {
      next.name = "Name is required";
    }

    if (!trimmedEmail) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
        toast.success("Welcome back!");
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
        toast.success("Account created successfully!");
      }
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Authentication failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setErrors({});
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
            <CheckCircle2 className="h-7 w-7 text-white" aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your tasks, beautifully organized
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/80 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Quick Demo Access
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("test1@gmail.com");
                      setPassword(" test@123");
                      setErrors({});
                      toast.success("Demo credentials filled!");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200/40"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg">
                    <span className="font-medium text-slate-500">Email</span>
                    <code className="px-1.5 py-0.5 rounded font-mono text-slate-800 bg-slate-50">
                      test1@gmail.com
                    </code>
                  </div>
                  <div className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg">
                    <span className="font-medium text-slate-500">Password</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40 font-medium">
                        Starts with a space
                      </span>
                      <code className="px-1.5 py-0.5 rounded font-mono text-slate-800 bg-slate-50">
                        {" "}test@123
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
