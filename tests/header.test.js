const { session } = require('passport')
const Page = require('./helpers/page')

let page
beforeEach(async () => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})
test('the header has the correct text', async () => {
  const text = await page.getHTML('.brand-logo')
  expect(text).toEqual('Blogster')
})

afterEach(async () => {
  await page.close()
})
