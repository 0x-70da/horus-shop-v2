import { create } from 'zustand';

import { persist } from 'zustand/middleware';

interface ThemeStore {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist((set, get) => ({
        theme: 'light',
        toggleTheme: () => {
            const newTheme = get().theme === 'light' ? 'dark' : 'light';
            document.documentElement.classList.remove(get().theme);
            document.documentElement.classList.add(newTheme);
            set({ theme: newTheme });
        }
    }),
        {name: 'theme'}
    )
)