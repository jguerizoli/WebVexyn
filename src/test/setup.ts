import '@testing-library/jest-dom';
import { vi } from 'vitest';
import translationEN from '../locales/en/translation.json';

vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string, _options?: any) => {
        const keys = key.split('.');
        let val: any = translationEN;
        for (const k of keys) {
          if (val && typeof val === 'object' && k in val) {
            val = val[k];
          } else {
            return key; // Fallback to key name if not found
          }
        }
        return val;
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'en',
      },
    };
  },
}));
