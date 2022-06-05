const Page = require('./helpers/page')

let page
beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})
describe('when logged in', async () => {
  beforeEach(async () => {
    await page.click('.right a ')
    await page.click('a.red')
  })
  test('can see blog create form', async () => {
    const text2 = await page.getHTML('.title label')
    expect(text2).toEqual('Blog Title')
  })

  describe('using invalid input', async () => {
    beforeEach(async () => {
      await page.click('form button')
    })
    test('the form shows an error message', async () => {
      const titleError = await page.getHTML('.title .red-text')
      const contentError = await page.getHTML('.content .red-text')
      expect(titleError).toEqual('You must provide a value')
      expect(contentError).toEqual('You must provide a value')
    })
  })

  describe('using valid input', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title')
      await page.type('.content input', 'My Content')
      await page.click('form button')
    })
    test('submitting to take user to review screen', async () => {
      const text = await page.getHTML('h5')
      expect(text).toEqual('Please confirm your entries')
    })
    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green')
      await page.waitFor('.card')
      const title = await page.getHTML('.card-title')
      const content = await page.getHTML('p')
      expect(title).toEqual('My Title')
      expect(content).toEqual('My Content')
    })
  })
})

afterEach(async () => {
  await page.close()
})
