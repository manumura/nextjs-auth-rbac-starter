import { create } from 'zustand';
import { IUser } from '../types/custom-types';

type UserState = {
  user: IUser | null;
  setUser: (user: IUser | null) => void; 
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user): void => set((state) => ({ ...state, user })),
}));

export default useUserStore;
