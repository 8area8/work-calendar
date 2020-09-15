import { MockAuthService } from "../../src/clean_architecture/services/auth.mock";

test("auth can return two tokens on good authentication.", async () => {
  const auth = new MockAuthService();
  let response = await auth.authenticate("user", "user");
  expect(response).toHaveProperty("token");

  response = await auth.authenticate("admin", "admin");
  expect(response).toHaveProperty("token");
});

test("auth return false on bad authentication.", async () => {
  const auth = new MockAuthService();
  let response = await auth.authenticate("foo", "foo");
  expect(typeof response).toEqual("boolean");
});

test("auth refresh existing token.", async () => {
  const auth = new MockAuthService();
  let response = await auth.refresh("userrefresh");
  expect(typeof response).toEqual("string");
});

test("auth refresh bad token.", async () => {
  const auth = new MockAuthService();
  let response = await auth.refresh("foo");
  expect(response).toHaveProperty("type");
});
