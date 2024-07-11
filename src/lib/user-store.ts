import { create } from 'zustand';
import { IUser } from '../types/custom-types';
import { getCurrentUserFromStorage } from './utils';

type UserState = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
};

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user): void => set((state) => ({ ...state, user })),
}));

getCurrentUserFromStorage().then((currentUser) => {
  console.log('init currentUser', currentUser);
  useUserStore.getInitialState().user = currentUser;
});

export default useUserStore;
