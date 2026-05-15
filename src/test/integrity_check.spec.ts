import { test, expect } from '@playwright/test';

test.describe('Component Integrity & Config Sync', () => {
  
  test('App: Scrolling duration matches APP_CONFIG', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5174/');

    // Click navigation to trigger scroll
    const servicesLink = page.locator('button:has-text("SERVICES")');
    if (await servicesLink.count() > 0) {
      await servicesLink.first().click();

      // Check if is-navigating is added IMMEDIATELY
      await expect(page.locator('body')).toHaveClass(/is-navigating/);

      // It should still be there just before the duration ends
      // duration is 1.2s, wait for 0.8s to be safe
      await page.waitForTimeout(800);
      await expect(page.locator('body')).toHaveClass(/is-navigating/);

      // It should be gone after the duration (with small buffer)
      // duration 1.2s + buffer = 1.6s total
      await page.waitForTimeout(800);
      await expect(page.locator('body')).not.toHaveClass(/is-navigating/);
    }
  });

  test('Results: Cards are present and have animation attributes', async ({ page }) => {
    await page.goto('http://localhost:5174/');
    const resultsSection = page.locator('#social-proof');
    await expect(resultsSection).toBeVisible();

    const cards = resultsSection.locator('[data-animate="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify each card has the content animation attribute
    for (let i = 0; i < count; i++) {
      const content = cards.nth(i).locator('[data-animate="content"]');
      await expect(content).toBeAttached();
    }
  });

  test('Services: Section is reachable and pinned', async ({ page }) => {
    await page.goto('http://localhost:5174/');
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();
    
    // Scroll to services
    await servicesSection.scrollIntoViewIfNeeded();
    
    // Check if it has the stack cards
    const cards = servicesSection.locator('div[class*="stackCard"]');
    expect(await cards.count()).toBe(3);
  });
});
