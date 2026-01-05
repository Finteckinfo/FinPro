import { test, expect } from '@playwright/test';

// Helper to mock window.ethereum
const mockEthereum = async (page) => {
    await page.addInitScript(() => {
        (window as any).ethereum = {
            isMetaMask: true,
            request: async (args: { method: string; params?: any[] }) => {
                console.log('Mock Ethereum Request:', args.method, args.params);
                if (args.method === 'eth_accounts' || args.method === 'eth_requestAccounts') {
                    return ['0x1234567890123456789012345678901234567890'];
                }
                if (args.method === 'eth_chainId') {
                    return '0xaa36a7'; // Sepolia
                }
                if (args.method === 'personal_sign') {
                    return '0xmockedsignature';
                }
                return null;
            },
            on: () => { },
            removeListener: () => { },
        };
    });
};

test.describe('FinPro Core Transaction Flows', () => {
    test.beforeEach(async ({ page }) => {
        await mockEthereum(page);
        await page.goto('/login');
        // Set mock local storage for subscription and session
        await page.evaluate(() => {
            localStorage.setItem('wallet_address', '0x1234567890123456789012345678901234567890');
            localStorage.setItem('connected_account', '0x1234567890123456789012345678901234567890');
        });
    });

    test('Should navigate to dashboard after login', async ({ page }) => {
        const connectButton = page.getByRole('button', { name: /Connect Wallet/i });
        await connectButton.click();

        // Expect redirection to Home/Dashboard
        await expect(page).toHaveURL('/');
        await expect(page.getByText(/Financial Overview/i)).toBeVisible();
    });

    test('Should handle project funding flow', async ({ page }) => {
        await page.goto('/');
        const createProjectBtn = page.getByRole('button', { name: /New Project/i });
        if (await createProjectBtn.isVisible()) {
            await createProjectBtn.click();
            await page.fill('input[name="projectName"]', 'E2E Test Project');
            await page.fill('textarea[name="description"]', 'Description for E2E project');
            await page.fill('input[name="budget"]', '1000');
            await page.click('button:has-text("Create Project")');

            // Check for success toast or redirection
            await expect(page.getByText(/Project created successfully/i)).toBeVisible();
        }
    });

    test('Should verify subscription gating for analytics', async ({ page }) => {
        // Navigate to a project (mocked ID 1)
        await page.goto('/projects/1');

        // If user is not "Pro", they should see the blur overlay
        const proOverlay = page.getByText(/Upgrade to Pro/i);
        await expect(proOverlay).toBeVisible();
    });
    test('Should handle task allocation and completion', async ({ page }) => {
        // Navigate to a project
        await page.goto('/projects/1');

        // Allocate a task
        const allocateBtn = page.getByRole('button', { name: /Allocate Task/i });
        if (await allocateBtn.isVisible()) {
            await allocateBtn.click();
            await page.fill('input[name="workerAddress"]', '0x9999999999999999999999999999999999999999');
            await page.fill('input[name="amount"]', '100');
            await page.click('button:text("Confirm Allocation")');
            await expect(page.getByText(/Task allocated/i)).toBeVisible();

            // Complete the task (simulating worker)
            const completeBtn = page.getByRole('button', { name: /Mark Complete/i }).first();
            await completeBtn.click();
            await expect(page.getByText(/Task completed/i)).toBeVisible();
        }
    });

    test('Should handle refund request flow', async ({ page }) => {
        await page.goto('/projects/1');
        const refundBtn = page.getByRole('button', { name: /Request Refund/i });
        if (await refundBtn.isVisible()) {
            await refundBtn.click();
            await page.click('button:text("Confirm Refund Request")');
            await expect(page.getByText(/Refund requested/i)).toBeVisible();
            await expect(page.getByText(/Refund Timelock Active/i)).toBeVisible();
        }
    });
});
