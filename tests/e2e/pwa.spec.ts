import { test, expect } from '@playwright/test';

test.describe('PWA Add to Home Screen (A2HS)', () => {
  test('should capture and trigger beforeinstallprompt', async ({ page }) => {
    // 1. Inject a listener before the page loads to capture the event interactions.
    // Real browsers fire 'beforeinstallprompt' organically based on heuristics, 
    // but in automation we must simulate it. We hook into it to ensure the app is listening.
    await page.addInitScript(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)['deferredPrompt'] = e;
      });
    });

    await page.goto('/');

    // Verify app loaded
    await expect(page).toHaveTitle(/Markdowner/i);

    // 2. Simulate the browser firing the PWA install event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      
      // Mock the prompt() method the app will call
      Object.defineProperty(event, 'prompt', { 
          value: async () => {},
          writable: true 
      });
      
      // Mock the userChoice promise the app will await
      Object.defineProperty(event, 'userChoice', { 
        value: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
        writable: true
      });
      
      window.dispatchEvent(event);
    });

    // 3. Verify the PWA Install UI reacted. Note: Adapt the specific text/selector 
    // to match your actual Snackbar/Button text in PWAInstallPrompt.tsx
    const installBtn = page.getByRole('button', { name: /install/i });
    
    // Depending on timing and component logic, it should become visible
    await expect(installBtn).toBeVisible({ timeout: 5000 });
    
    // 4. Click the button. We use force: true because the Snackbar is a fixed overlay. 
    // Playwright sometimes fails hit-tests on fixed elements when they overlap with 
    // scrolled content, even if the z-index is correct.
    await installBtn.click({ force: true });
    
    // The prompt should go away after clicking
    await expect(installBtn).not.toBeVisible();
  });
});
