'use client';

import { useLayoutEffect } from 'react';
import { UnitSystem } from '@/lib/units';
import { DarkMode, useSettings } from '@/hooks/useSettings';

interface SettingsProps {
  className?: string;
}

export default function Settings({ className = '' }: SettingsProps) {
  const { unitSystem, setUnitSystem, darkMode, setDarkMode } = useSettings();

  // Handle dark mode changes
  useLayoutEffect(() => {
    const applyDarkMode = () => {
      const htmlElement = document.documentElement;
      
      if (darkMode === 'dark') {
        htmlElement.classList.add('dark');
      } else if (darkMode === 'light') {
        htmlElement.classList.remove('dark');
      } else if (darkMode === 'auto') {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          htmlElement.classList.add('dark');
        } else {
          htmlElement.classList.remove('dark');
        }
      }
    };

    applyDarkMode();

    // Listen for system theme changes when in auto mode
    if (darkMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyDarkMode();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [darkMode]);

  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit System
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="unitSystem"
                value="metric"
                checked={unitSystem === 'metric'}
                onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Metric (km, m, km/s)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="unitSystem"
                value="imperial"
                checked={unitSystem === 'imperial'}
                onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Imperial (mi, ft, mph)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Appearance
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="darkMode"
                value="light"
                checked={darkMode === 'light'}
                onChange={(e) => setDarkMode(e.target.value as DarkMode)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="darkMode"
                value="dark"
                checked={darkMode === 'dark'}
                onChange={(e) => setDarkMode(e.target.value as DarkMode)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="darkMode"
                value="auto"
                checked={darkMode === 'auto'}
                onChange={(e) => setDarkMode(e.target.value as DarkMode)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}