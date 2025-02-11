import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  publicAddress: string;
  username: string;
  company?: string;
  tags?: string[];
  transaction?: string;
  walletType: "magic-link" | "rainbow-kit";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const clearUser = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    user,
    setUser: (newUser: User | null) => {
      setUser(newUser);
      if (newUser) {
        sessionStorage.setItem("user", JSON.stringify(newUser));
      } else {
        sessionStorage.removeItem("user");
      }
    },
    isAuthenticated,
    clearUser,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Usage example:
/*
// In your App.tsx or root component:
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          // ... your routes
        </Routes>
      </Router>
    </UserProvider>
  );
}

// In any component:
function Profile() {
  const { user, updateUser, clearUser } = useUser();

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <button onClick={() => updateUser({ username: 'New Name' })}>
        Update Name
      </button>
      <button onClick={clearUser}>Logout</button>
    </div>
  );
}
*/
