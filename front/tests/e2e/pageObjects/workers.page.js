class Page {
  open(path = "http://localhost:8000/#/workers/") {
    browser.url(path);
  }
}

module.exports = new Page();
