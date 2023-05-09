import { create } from "zustand";

type DrawerOpenState = {
  open: boolean | undefined;
  setOpen: (open: boolean) => void;
};

const useDrawerOpenStore = create<DrawerOpenState>((set) => ({
  open: false,
  setOpen: (open) => set((state) => ({ ...state, open })),
}));

export default useDrawerOpenStore;
