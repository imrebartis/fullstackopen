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

    test('only the user that created the blog can remove the blog', async ({
      page,
      request,
    }) => {
      await page.getByTestId('logout-button').click()
      await page.waitForSelector('text="Log in to application"')
      await request.post('http:localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Testikäyttäjä',
          username: 'testikäyttäjä',
          password: 'secret',
        },
      })

      await login(page, 'testikäyttäjä', 'secret')
      await expect(page.getByText('Testikäyttäjä logged in')).toBeVisible()

      await page.waitForSelector('text="a blog created by playwright"', {
        timeout: 10000,
      })
      expect(
        await page.locator('text="a blog created by playwright"').isVisible()
      ).toBe(true)

      await page.getByTestId('visibility-button').click()

      expect(await page.getByTestId('remove-button').isVisible()).toBe(false)
    })
  })

  describe('and at least two blogs exist', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'testuser', 'salainen')
      await createBlog(
        page,
        'first blog created by playwright',
        'http://www.example1.com'
      )
      await createBlog(
        page,
        'second blog created by playwright',
        'http://www.example2.com'
      )
      await createBlog(
        page,
        'third blog created by playwright',
        'http://www.example3.com'
      )
    })

    test('blogs are displayed in order of likes', async ({ page }) => {
      await page.waitForFunction(
        () => document.querySelectorAll('[data-testid="blog"]').length >= 2
      )

      const blogs = await page.$$('[data-testid="blog"]')

      if (blogs.length < 2) {
        throw new Error('Not enough blogs found')
      }

      const blogOne = blogs[0]
      const blogTwo = blogs[1]

      await page.waitForSelector('text="third blog created by playwright"')

      const visibilityButtonOne = await blogOne.$(
        '[data-testid="visibility-button"]'
      )
      const likeButtonOne = await blogOne.$('[data-testid="like-button"]')

      await visibilityButtonOne.click()
      await likeButtonOne.click()

      const visibilityButtonTwo = await blogTwo.$(
        '[data-testid="visibility-button"]'
      )
      await visibilityButtonTwo.click()

      for (let i = 0; i < 5; i++) {
        const likeButtonTwo = await blogTwo.$('[data-testid="like-button"]')
        if (!likeButtonTwo) {
          throw new Error('Like button not found in the second blog')
        }
        await likeButtonTwo.click()
      }

      const updatedBlogs = await page.$$('[data-testid="blog"]')

      const likes = await Promise.all(
        updatedBlogs.map(async (blog) => {
          const likesElement = await blog.$('[data-testid="number-of-likes"]')
          const likesText = await likesElement.innerText()
          const likesNumber = parseInt(
            likesText.replace('number-of-likes', '').trim(),
            10
          )
          return likesNumber
        })
      )

      function isSortedDescending(array) {
        return array.every(
          (value, index, array) => index === 0 || array[index - 1] >= value
        )
      }
      expect(isSortedDescending(likes)).toBe(true)
    })
  })
})
