# Authentication UseCase

If you are not authenticated, you will be redirected to the authentication page.

## Client part

This page asks for a username and a password.

By default, there are only three types of users for this application :

- the super-user who will have access to all features
- the simple user who will have read-only access to most of the data
- The anonymous user has no access to any page or data.

If the password or username is wrong, an equivocal error message will be displayed below the corresponding field.
Note: the data will not be deleted.

If the fields are correct, the authentication will redirect to the main calendar page.

## Technical part

- The frontend saves the tokens received in the LocalStorage. At each request, axios is configured to send the access token.
  - If the access token has expired, axios tries to regenerate the access token using the regeneration token.
    - If the regeneration works, then axios repeats its request.
    - If not, the user is redirected to the authentication page.
