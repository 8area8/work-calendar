const MainPage = require("../pageObjects/main.page");
const AuthPage = require("../pageObjects/auth.page");

describe("Calendar component", () => {
  it("should redirect on authentication", () => {
    MainPage.open();
    browser.execute("localStorage.clear();");
    MainPage.open();
    expect(browser).toHaveUrl("http://localhost:8000/#/auth");
  });

  it("should redirect on index page after authentication.", () => {
    MainPage.open();
    $("#username").setValue("admin");
    $("#password").setValue("admin");
    $("#authenticate").click();
    browser.pause(500);
    expect(browser).toHaveUrl("http://localhost:8000/#/");
  });
});
