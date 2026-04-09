'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnitSystem } from '@/lib/units';

export type DarkMode = 'light' | 'dark' | 'auto';

interface SettingsState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      unitSystem: 'metric',
      setUnitSystem: (unitSystem: UnitSystem) => set({ unitSystem }),
      darkMode: 'auto',
      setDarkMode: (darkMode: DarkMode) => set({ darkMode }),
    }),
    {
      name: 'satcom-settings',
    }
  )
);