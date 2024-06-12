const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    expect(usernameInput).not.toBeNull()
    expect(passwordInput).not.toBeNull()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const usernameInput = await page.getByTestId('username')
      const passwordInput = await page.getByTestId('password')
      await usernameInput.fill('testuser')
      await passwordInput.fill('salainen')
      await page.getByRole('button', { name: 'log in' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const usernameInput = await page.getByTestId('username')
      const passwordInput = await page.getByTestId('password')
      await usernameInput.fill('testuser')
      await passwordInput.fill('secret')
      await page.getByRole('button', { name: 'log in' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
})
