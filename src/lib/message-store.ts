import { create } from 'zustand';
import { IMessage } from '../types/custom-types';

type MessageState = {
  message: IMessage | null;
  setMessage: (message: IMessage | null) => void;
  clearMessage: () => void;
};

const useMessageStore = create<MessageState>((set) => ({
  message: null,
  setMessage: (message): void => set((state) => ({ ...state, message })),
  clearMessage: (): void => set((state) => ({ ...state, message: null })),
}));

export default useMessageStore;
