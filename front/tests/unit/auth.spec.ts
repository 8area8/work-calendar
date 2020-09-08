import { MockAuthService } from "../../src/clean_architecture/services/auth";
import axios from "axios";

test("auth can return two token on good authentication.", async () => {
  const auth = new MockAuthService();
  let response = await auth.authenticate("user", "user");
  expect(response).toBeTruthy();

  response = await auth.authenticate("admin", "admin");
  expect(response).toBeTruthy();
});

test("auth return false on bad authentication.", async () => {
  const auth = new MockAuthService();
  let response = await auth.authenticate("foo", "foo");
  expect(response).toBeFalsy();
});

test("auth refresh existing token.", async () => {
  const auth = new MockAuthService();
  let response = await auth.refresh("userrefresh");
  expect(response).toBeTruthy();
});

test("auth refresh existing token.", async () => {
  const auth = new MockAuthService();
  let response = await auth.refresh("foo");
  expect(response).toBeFalsy();
});
