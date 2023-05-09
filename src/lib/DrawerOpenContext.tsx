"use client";

// TODO use store
import { createContext, useContext, useState } from "react";

interface DrawerOpenContextType {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
}

export const DrawerOpenContext = createContext<DrawerOpenContextType>({
  open: undefined,
  setOpen: async (open) => {},
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
