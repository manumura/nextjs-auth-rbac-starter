import { createContext, useContext, useState } from "react";

export const DrawerOpenContext = createContext({
  open: undefined,
  setOpen: async (open) => null,
});

export const useDrawerOpen = () => useContext(DrawerOpenContext);

export const DrawerOpenProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerOpenContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerOpenContext.Provider>
  );
};
