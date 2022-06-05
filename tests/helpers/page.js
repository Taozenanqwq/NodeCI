const puppeteer = require('puppeteer')
class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    })
    const page = await browser.newPage()
    const myPage = new Page(page)
    return new Proxy(myPage, {
      get(target, property) {
        return myPage[property] || browser[property] || page[property]
      }
    })
  }
  constructor(page) {
    this.page = page
  }
  async getHTML(selector) {
    const content = await this.page.$eval(selector, (el) => el.innerHTML)
    return content
  }
}
module.exports = Page
