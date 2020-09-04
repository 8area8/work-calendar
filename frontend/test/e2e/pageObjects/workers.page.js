class Page {
  open(path = '/workers/') {
    browser.url(path)
  }
}

module.exports = new Page()
