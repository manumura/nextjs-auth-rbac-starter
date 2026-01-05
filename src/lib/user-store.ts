import { create } from 'zustand';
import { IAuthenticatedUser } from '../types/custom-types';

type UserState = {
  user: IAuthenticatedUser | null;
  setUser: (user: IAuthenticatedUser | null) => void; 
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user): void => set((state) => ({ ...state, user })),
}));

export default useUserStore;
