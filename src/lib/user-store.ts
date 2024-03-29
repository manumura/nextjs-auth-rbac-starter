import { UUID } from 'crypto';
import { create } from 'zustand';

export type IUser = {
  uuid: UUID;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type UserState = {
  user: IUser | null;
  setUser: (user: IUser | undefined) => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user): void => set((state) => ({ ...state, user })),
}));

export default useUserStore;
