class Page {
  open(path = "http://localhost:8000/auth/") {
    browser.url(path);
  }
}

module.exports = new Page();
