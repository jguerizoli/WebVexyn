import { test, expect } from '@playwright/test';

test('Orchestration: is-navigating class and interaction lock', async ({ page }) => {
  await page.goto('http://localhost:5174/');

  // Check initial state
  await expect(page.locator('body')).not.toHaveClass(/is-navigating/);

  // Find a navigation link (e.g., in Sidebar)
  const servicesLink = page.locator('button:has-text("SERVICES")');
  
  if (await servicesLink.count() > 0) {
    // Click the link
    await servicesLink.first().click();

    // NEW CHECK: Sidebar should highlight INSTANTLY (activeSection updated in onStart)
    await expect(servicesLink.first()).toHaveClass(/isActive/);

    // Check if is-navigating class is added immediately
    await expect(page.locator('body')).toHaveClass(/is-navigating/);

    // Verify pointer-events: none is applied via computed style
    const pointerEvents = await page.evaluate(() => {
      return window.getComputedStyle(document.body).pointerEvents;
    });
    expect(pointerEvents).toBe('none');

    // Wait for animation to finish (1.5s + buffer)
    await page.waitForTimeout(2000);

    // Check if class is removed
    await expect(page.locator('body')).not.toHaveClass(/is-navigating/);
  } else {
    console.log('Services link not found, skipping specific click test');
  }
});
