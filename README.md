# Full Stack Open — Part 8 (GraphQL)

Solutions for the [Full Stack Open](https://fullstackopen.com/en/part8) GraphQL
part: a small library application with an Apollo Server backend (MongoDB) and a
React + Apollo Client frontend.

## CI status

[![Test library-backend](https://github.com/riikkayoki/fullstackopen-part8/actions/workflows/test-chapter4.yml/badge.svg)](https://github.com/riikkayoki/fullstackopen-part8/actions/workflows/test-chapter4.yml)
[![E2E tests (library)](https://github.com/riikkayoki/fullstackopen-part8/actions/workflows/test-chapter5.yml/badge.svg)](https://github.com/riikkayoki/fullstackopen-part8/actions/workflows/test-chapter5.yml)

- **Test library-backend** — backend query/mutation tests (`tests-chapter4`), run with an in-memory MongoDB.
- **E2E tests (library)** — Playwright end-to-end tests of the frontend against the backend (`tests-chapter5`).

## Project structure

| Directory | What it is |
|-----------|------------|
| `library-backend` | Apollo Server + Mongoose GraphQL API |
| `library-frontend` | React + Apollo Client (Vite) UI |
| `tests-chapter4` | Backend tests (Node test runner + in-memory MongoDB) |
| `tests-chapter5` | Playwright end-to-end tests |

## Running the app

Run `npm install` in each project directory first.

### Backend (`library-backend`) → http://localhost:4000

Needs a MongoDB connection. Create a `.env` file (see `.env.example`):

```bash
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/library?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-secret-string>
```

Then:

```bash
cd library-backend
npm install
npm run dev          # GraphQL + Apollo Sandbox at http://localhost:4000
```

### Frontend (`library-frontend`) → http://localhost:5173

```bash
cd library-frontend
npm install
npm run dev          # app at http://localhost:5173
```

The frontend talks to `http://localhost:4000` by default (override with the
`VITE_BACKEND_URI` env variable). Log in with any user created via the
`createUser` mutation — the password is the hard-coded `secret`.

## Running the tests

### Backend tests (`tests-chapter4`)

No database setup needed — the suite spins up its own in-memory MongoDB.

```bash
cd tests-chapter4
npm install
npm test
```

### End-to-end tests (`tests-chapter5`)

Playwright starts its own backend (in-memory MongoDB, test mode) and frontend,
so you don't need to start anything yourself. Install the browser once:

```bash
cd tests-chapter5
npm install
npx playwright install chromium
npm test                 # or: npm run test:report  to view the HTML report
```
