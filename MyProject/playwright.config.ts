import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './Tests',
  use: {
    headless: false,
    slowMo: 300,
    baseURL: 'https://www.demoblaze.com/',
  },
  reporter: [
    ['html', { outputFolder: 'Results/html-report', open: 'never' }],
    ['list'],
  ],
});
