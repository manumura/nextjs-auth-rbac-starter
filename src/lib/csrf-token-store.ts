import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CsrfTokenState = {
  csrfToken: string | null;
  setCsrfToken: (csrfToken: string | null) => void; 
};

const useCsrfTokenStore = create<CsrfTokenState>()(
  persist(
    (set) => ({
      csrfToken: null,
      setCsrfToken: (csrfToken) => set({ csrfToken }),
    }),
    {
      name: 'csrf-token',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCsrfTokenStore;