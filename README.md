# Work Calendar

A calendar application to manage its employees.

![calendar shot](/doc/calendar-shot.jpg)
Photo by [Estée Janssens](https://unsplash.com/@esteejanssens?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/calendar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

## Workflows

- **Git**: Basic messages with Header and Content - Gitmojis
- **Global**: UsesCases - Test Driven Developement - Clean Architecture
- **Python**: PEP8 - PEP257
- **Javascript**: modern Javascript

## Stack

- Python3 and `Django Rest Framework`
- NodeJS and `Nuxt.js`, `SCSS`, `Typescript`, `Buefy`
- PostgreSQL

## Installation

This project uses **NodeJs** `v12` and **Python** `v3.7`.
You also need a **PostgreSQL** database.
Clone this repository, then run the following commands at the root of the repository:

```bash
# frontend installation
$ cd front && npm install && npm run generate && cd ..

# backend installation
$ pip install pipenv && pipenv install && pipenv run python manage.py migrate
```

The project uses some `env` variables :

```bash
SECRET_KEY  # Django secret key

DB_USER  # database user name
DB_PASS  # database user password
DB_NAME  # database name
DB_HOST  # database host
DB_PORT  # database port
```

## Usage

Run `pipenv run python manage.py runserver` then go to `http://localhost:8000/`

## Local developement

Rather than generating the frontend at each modification, you can simply use the `cd front; npm run dev` command. The command will generate the front-end Nuxt server at `http://localhot:3000` with the Hot Reload.
Run `pipenv run python manage.py runserver` to launch the backend API.

## Tests

The project uses :

- **WebDriver.io** for end2end tests.
- **[Jest](https://jestjs.io/)** for frontend unit testing.
- **[Pytest](https://docs.pytest.org/en/stable/)** for python unit testing.

> Note: Travis-ci only launches unit tests, the end2end tests being very heavy to set up in CI.

### Launch local tests

```bash
# End2end tests
$ cd front; npm run test:e2e  # need a running server.
# Javascript unit tests
$ cd front; npm run test:unit

# Python unit tests
$ pipenv run python pytest back/tests
```

## Continuous Developement

The project uses Travis-ci. Add your fork to travis-ci.com and enjoy ! Read `.travis.yml` for more informations about the configuration.

## Continuous Integration

If the tests pass, Travis-ci deploy the application to Heroku. For more informations, [read the following link](https://docs.travis-ci.com/user/deployment/heroku/).

## License

**MIT License** - For more informations, Read the `LICENSE` file.
