import React, { useContext, useState } from "react";

export const AuthContext = React.createContext({
  user: undefined,
  setUser: async (user) => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
