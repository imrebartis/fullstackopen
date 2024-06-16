const { test, expect, beforeEach, describe } = require('@playwright/test')

const login = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'log in' }).click()
}

const createBlog = async (page, title, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('url').fill(url)
  await page.getByTestId('create-button').click()
}

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
      await login(page, 'testuser', 'salainen')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'testuser', 'secret')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'testuser', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'http://www.example.com'
      )
      await page.waitForSelector('text="a blog created by playwright"')
      expect(
        await page.locator('text="a blog created by playwright"').isVisible()
      ).toBe(true)
    })
  })

  describe('and a blog exists', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'testuser', 'salainen')
      await createBlog(
        page,
        'a blog created by playwright',
        'http://www.example.com'
      )
    })

    test('blog can be liked', async ({ page }) => {
      await page.getByTestId('visibility-button').click()
      await page.getByTestId('like-button').click()
      await expect(await page.getByText('likes 1')).toBeVisible()
    })

    test('blog can be removed', async ({ page }) => {
      await page.getByTestId('visibility-button').click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByTestId('remove-button').click()
      const blogTitle = 'a blog created by playwright'
      const expectedMessage = `Blog ${blogTitle} by removed`
      await page.waitForFunction(
        `document.body.innerText.includes('${expectedMessage}')`
      )

      const blogExists = await page.evaluate(
        `!!document.querySelector('[data-testid="blog"]')`
      )
      expect(blogExists).toBe(false)
    })
  })
})
