import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../config"; // alag file se import


// User ka type
interface UserType {
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // --- Sign Up Function ---
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Sign-up failed" };
      }

      setUser({ email: data.user.email, name: data.user.name });
      localStorage.setItem("user", JSON.stringify(data.user));

      return { error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: "Unknown error" };
    }
  };

  // --- Sign In Function ---
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      setUser({ email: data.user.email, name: data.user.name });
      localStorage.setItem("user", JSON.stringify(data.user));

      return { error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: "Unknown error" };
    }
  };

  // --- Sign Out Function ---
  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
