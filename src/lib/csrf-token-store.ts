import { create } from 'zustand';

type CsrfTokenState = {
  csrfToken: string | null;
  setCsrfToken: (csrfToken: string | null) => void; 
};

const useCsrfTokenStore = create<CsrfTokenState>((set) => ({
  csrfToken: null,
  setCsrfToken: (csrfToken): void => set((state) => ({ ...state, csrfToken })),
}));

export default useCsrfTokenStore;