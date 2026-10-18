# Ndosi Automation — Profile Picture Upload

Playwright + TypeScript (Page Object Model) suite that logs into [Ndosi Simplified Automation](https://ndosisimplifiedautomation.vercel.app/information), uploads a new profile picture via the UI, and validates the API calls made along the way.

## Stack
- Playwright + TypeScript, Page Object Model (`src/pages/`)
- Tests in `tests/profilePicture.spec.ts` (UI journey) and `tests/api/` (endpoint validation)
- HTML report + screenshots on every run
- GitHub Actions CI, runs on push/PR/manual trigger and a daily schedule (00:00 UTC)

## Setup
```powershell
npm install
npx playwright install --with-deps chromium firefox
copy .env.example .env   # fill in BASE_URL / API_BASE_URL / APP_EMAIL / APP_PASSWORD / API_EMAIL
```

## Run
```powershell
npx playwright test                       # all tests
npx playwright test tests/profilePicture.spec.ts
npx playwright test tests/api
npx playwright show-report
```

## Test flow
**UI:** login → menu → my profile → edit profile → upload picture → save → verify avatar updated.
**API:** network calls made during the UI flow are captured and their response codes asserted.

## CI
`.github/workflows/playwright.yml` runs on push to main/master, on pull requests, on a daily schedule, and on manual trigger; uploads the HTML report + test results as workflow artifacts.

## Config
Credentials are read from environment variables (`BASE_URL`, `API_BASE_URL`, `APP_EMAIL`, `APP_PASSWORD`, `API_EMAIL`), stored as GitHub Actions secrets in CI — never hardcoded.

The API spec logs in as a second account (`API_EMAIL`, defaults to `bokang@gmail.com`) rather than reusing `APP_EMAIL`, because the backend only allows one active session per user and a second login invalidates the first. For the same reason, `playwright.config.ts` runs with a single worker — otherwise the chromium and firefox projects would log into the same account at once and intermittently invalidate each other's session.

