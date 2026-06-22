# Portfolio Planner Editing Guardrails

Use this file as the instruction block for Codex when working on the AGM portfolio planner.

## Scope

Only work on the portfolio planner in **AGM Hub**.

This means:

- The planner lives in the public risk flow in `agm-hub`.
- Do not expand the work outside Hub unless the user explicitly asks for backend support.

## Main Goal

If the request is about the portfolio planner UI, behavior, layout, colors, sliders, cards, gauge, archetype selector, or planner flow inside the risk page, stay inside the Hub planner files only unless a change clearly requires one of the support files listed below.

## Files You Are Allowed To Edit

Primary planner UI:

- `agm-hub/src/components/hub/risk/PortfolioPlanner.tsx`
- `agm-hub/src/components/hub/risk/RiskForm.tsx`
- `agm-hub/src/app/[lang]/(public)/risk/page.tsx`

Planner support files:

- `agm-hub/src/components/ui/slider.tsx`
- `agm-hub/src/lib/clients/portfolio-planner.ts`
- `agm-hub/src/lib/clients/portfolio-plans.ts`
- `agm-hub/src/utils/clients/portfolio-plans.ts`
- `agm-hub/src/utils/clients/investment_proposals.ts`
- `agm-hub/src/components/hub/risk/InvestmentProposal.tsx`

Only edit support files if the request actually needs them.

## Files You Must Not Touch

Do not edit these unless the user explicitly asks for them:

- Anything in `agm-api`
- Database schema or SQL
- Unrelated risk form question logic
- Auth, session, navbar, footer, homepage, or account flows
- Shared components outside the planner path unless the planner directly depends on them

## Hard Rules

1. Do not make a standalone Vite app.
2. Do not build a separate planner product.
3. Do not refactor random files just because they look messy.
4. Do not change API contracts unless the user explicitly asks for backend work.
5. Do not remove existing proposal functionality unless the request clearly says to.

## Current Product Reality

These are intentional and should stay true unless the user says otherwise:

- The planner is Hub-only.
- The planner appears inside the risk flow after the risk form.
- The planner can save a plan and generate an investment proposal.

## If The User Asks For UI Changes

Default to editing:

- `agm-hub/src/components/hub/risk/PortfolioPlanner.tsx`

Only expand beyond that if needed.

Examples of requests that should stay local to the planner UI:

- Remove or add headings
- Make the background white
- Change spacing or width
- Make sliders colored by asset
- Keep the corporate bond parent slider always visible
- Show archetypes as A / B / C
- Move cards between the two main columns

## If The User Asks For Logic Changes

First check whether the change is:

- local planner state or calculations
- plan payload shape already supported in hub
- proposal creation flow already supported in hub

If yes, stay inside Hub support files.

If the change truly needs backend or database work, stop and say that clearly instead of guessing.

## Local Runbook For Codex

If the user wants Codex to test the planner locally, Codex should run the API and the Hub together.

### API

Run the API from `agm-api` with a Python virtual environment:

```bash
cd /Users/aguilarcarboni/Developer/Repositories/AGM/agm-api
python3 -m venv venv
source venv/bin/activate
./venv/bin/pip install -r requirements.txt
set -a; source .env; set +a
./venv/bin/python run.py
```

Before starting the API, check whether port `5000` is already in use:

```bash
lsof -nP -iTCP:5000 -sTCP:LISTEN
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5000/
```

Rules:

- If `:5000` already has a healthy API returning `200`, reuse it.
- If `:5000` has a broken process, inspect it before replacing it.
- If startup fails because of missing secrets or Google Secret Manager access, say that clearly and stop pretending the API is running.

### Hub

Run the Hub separately on port `3001`:

```bash
cd /Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub
yarn install
set -a; source .env; set +a
yarn dev -p 3001
```

For local auth callback consistency, Hub should use:

```bash
NEXTAUTH_URL="http://localhost:3001"
```

### What Codex Should Do

If the user says to run the servers for testing, Codex should:

1. Check whether the API on `:5000` is already healthy and reuse it if it is.
2. Start the API only if no healthy API process exists.
3. Start `agm-hub` on `:3001`.
4. Keep both processes in visible sessions so logs can be checked during testing.
5. Verify with exact requests instead of guessing:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5000/
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3001/
```

If either service fails, report the exact command and exact error.

## Verification

After changes in Hub, run:

```bash
cd /Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub
yarn tsc --noEmit
```

If that fails, report the exact error.

Do not claim success without verifying.

## Response Style

Be direct and narrow:

- say what files were changed
- say what behavior changed
- say whether `agm-hub` typecheck passed
- mention blockers plainly

## Safe Default

If you are unsure whether a file is in scope, do **not** edit it.
Ask first or say it needs confirmation.
