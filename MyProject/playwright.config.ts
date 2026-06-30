import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './Tests',
  use: {
    headless: false,
    slowMo: 300,
    baseURL: process.env.BASE_URL || 'https://www.demoblaze.com/',
  },
  reporter: [
    ['html', { outputFolder: 'Results/html-report', open: 'never' }],
    ['list'],
  ],
});
