import { create } from "zustand";

export type IUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type UserState = {
  user: IUser | null;
  setUser: (user: IUser) => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ ...state, user })),
}));

export default useUserStore;
