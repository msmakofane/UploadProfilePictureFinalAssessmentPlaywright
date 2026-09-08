# Ndosi Automation — Profile Picture Upload

Playwright + TypeScript (Page Object Model) suite that logs into [Ndosi Simplified Automation](https://ndosisimplifiedautomation.vercel.app/information), uploads a new profile picture via the UI, and validates the API calls made along the way.

## Stack
- Playwright + TypeScript, Page Object Model (`pages/`)
- Tests in `tests/ui` (UI journey) and `tests/api` (endpoint validation)
- HTML report + screenshots on every run
- GitHub Actions CI, scheduled daily at 00:00 SAST (`cron: '0 22 * * *'`)

## Setup
```powershell
npm install
npx playwright install --with-deps chromium
copy .env.example .env   # fill in Usename / Password
```

## Run
```powershell
npx playwright test          # all tests
npx playwright test tests/ui
npx playwright test tests/api
npx playwright show-report
```

## Test flow
**UI:** login → menu → my profile → edit profile → upload picture → save → verify avatar updated.
**API:** network calls made during the UI flow are captured and their response codes asserted.

## CI
`.github/workflows/tests.yml` runs on schedule (daily, midnight SAST) and on manual trigger, uploads the HTML report + screenshots as workflow artifacts.

## Config
Credentials are read from environment variables (`USERNAME`, `PASSWORD`), stored as GitHub Actions secrets in CI — never hardcoded.

> Windows predefines a `USERNAME` system variable (your OS login name), which takes precedence over `.env`. If running locally on Windows, set it explicitly before running tests:
> ```powershell
> $env:USERNAME = "tumi@gmail.com"; $env:PASSWORD = "@12345678"; npx playwright test
> ```
