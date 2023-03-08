import { getProfile } from "@/server/api";
import { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "./storage";

export const AuthContext = createContext({
  user: undefined,
  setUser: async (user) => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

    // Try to auto-login the user
  useEffect(() => {
    const accessToken = getAccessToken();
    const doGetProfile = async (accessToken) => {
      try {
        const u = await getProfile(accessToken);
        setUser(u);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (!user && accessToken) {
      doGetProfile(accessToken);
    }
  }, [user, setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
