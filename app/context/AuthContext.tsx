import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { auth, initializeAuth } from "../DB/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Starting auth setup");

    // Initialize auth explicitly
    initializeAuth()
      .then(() => {
        console.log("AuthProvider: Auth initialized successfully");

        const currentUser = auth.currentUser;
        console.log("AuthProvider: Current user after init:", {
          user: currentUser?.email,
          uid: currentUser?.uid,
        });

        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        }

        const unsubscribe = auth.onAuthStateChanged(
          (user) => {
            console.log("AuthProvider: Auth state changed", {
              email: user?.email,
              uid: user?.uid,
              metadata: user?.metadata,
              providerId: user?.providerId,
            });
            setUser(user);
            setLoading(false);
          },
          (error) => {
            console.error("AuthProvider: Auth error", {
              message: error.message,
              stack: error.stack,
            });
            setLoading(false);
          }
        );

        return () => {
          console.log("AuthProvider: Cleaning up listener");
          unsubscribe();
        };
      })
      .catch((error) => {
        console.error("AuthProvider: Init error", {
          message: error.message,
          stack: error.stack,
        });
        setLoading(false);
      });
  }, []);

  console.log("AuthProvider: Rendering", {
    loading,
    userEmail: user?.email,
    uid: user?.uid,
    authCurrentUser: auth.currentUser?.email,
  });

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
