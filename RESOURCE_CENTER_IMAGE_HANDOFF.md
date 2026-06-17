# Resource Center Image Handoff

This file explains how to generate new Resource Center thumbnail images so they match the current Banking set in tone and quality without looking repetitive.

## Current Goal

Create wide carousel-card thumbnails for the AGM Hub Resource Center that:

- feel premium and finance-oriented
- look consistent as a family
- do **not** look like duplicated variants of the same image
- avoid generic stock-photo office scenes
- avoid text, logos, watermarks, and branded UI

The current reference set lives in:

- [deposit.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/deposit.png)
- [withdraw.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/withdraw.png)
- [link.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/link.png)
- [from-wise.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/from-wise.png)
- [to-wise.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/to-wise.png)
- [internal-same-banks.png](/Users/aguilarcarboni/Developer/Repositories/AGM/agm-hub/public/assets/resource-center/banking/internal-same-banks.png)

## Non-Negotiables

- Same overall **quality level**, not same exact composition.
- Each image must have its own **mood, palette, and visual identity**.
- Keep the same premium editorial/finance-thumbnail style across the set.
- Use a **16:9 landscape** composition suitable for carousel cards.
- No text inside the image.
- No logos, no icons from real brands, no watermarks.
- No people unless explicitly requested later.
- No purple bias.
- No crypto coin clichés unless the guide is explicitly crypto-related.

## Style Definition

The correct visual target is:

- polished finance editorial illustration
- cinematic but clean
- abstract digital finance scenes
- glossy glass UI panels
- subtle metallic reflections
- modern, high-trust, high-end product feel

The wrong target is:

- generic trading dashboard clone
- dark blue chart screen for everything
- stock-photo office workers
- app screenshots
- obvious fake mobile mockups with text
- overly busy “futuristic fintech” clutter

## Family Logic

Treat each section like a family:

- same rendering quality
- same thumbnail purpose
- same visual polish
- different emotional tone per card

Good example:

- all Banking images feel like they belong together
- but deposit feels fresh/inbound
- withdrawal feels warmer/outbound
- linking feels precise/connected
- Wise feels cross-border/multi-currency
- internal transfer feels symmetrical/technical

## Prompt Formula

Use this structure every time:

```text
Use case: stylized-concept
Asset type: website guide carousel card for a Resource Center section
Primary request: create a premium thumbnail image for the guide "<guide title>"
Scene/backdrop: <finance scene matching the guide action>
Subject: <the operational concept the guide represents>
Style/medium: high-end finance editorial illustration, premium website-thumbnail quality
Composition/framing: wide 16:9 landscape composition for a carousel card, strong focal center, clean framing
Lighting/mood: <specific emotional tone>
Color palette: <specific palette>
Materials/textures: glossy glass panels, subtle metallic accents, soft reflections, clean gradients
Constraints: no text, no letters, no words, no numbers, no logos, no watermark, no people, no clutter
Avoid: <what would make it look repetitive or wrong>
```

## Banking Palette Guide

Use this as the pattern for future sets: same discipline, different identities.

- Deposit Funds:
  teal, emerald, aqua, soft silver
  mood: optimistic, fresh, inbound

- Withdraw Funds:
  amber, coral, copper, graphite
  mood: controlled, outbound, slightly dramatic

- Link Bank Account:
  silver-blue, slate, icy cyan, pearl white
  mood: precise, connected, trustworthy

- Transfer From Wise:
  mint green, cyan, turquoise, soft navy
  mood: global, efficient, cross-border inbound

- Transfer To Wise:
  cool white, pale mint, seafoam, silver
  mood: light, outward, payout-oriented

- Internal Transfer:
  steel blue, indigo, cool silver, restrained violet-blue
  mood: structured, mirrored, internal-routing logic

## How To Avoid Repetition

When generating a new set, do not just swap colors. Also vary:

- motion direction
- focal object
- balance vs asymmetry
- brightness level
- depth and glow
- density of UI glass panels
- whether the scene feels inbound, outbound, mirrored, centralized, or networked

Example:

- `Deposit` should visually feel like something arriving
- `Withdraw` should visually feel like something leaving
- `Link` should feel like two systems being connected
- `Internal Transfer` should feel like two matched systems exchanging value

## Category Expansion Rules

### Banking

Use:

- money movement
- account linking
- secure transfer
- cross-border routing
- wallet/bank relationship

Avoid:

- candlestick chart overload
- investment/trading imagery unless the guide itself is about trading

### Trading

Use:

- market screens
- order flow
- permissions access
- data feed visuals
- options/risk/market structure

Avoid:

- making every trading card the same dark chart image

### Account Management

Use:

- account structure
- linked profiles
- transfer of ownership/positions
- organized, administrative, secure flows

Avoid:

- plain office desk photos

### Reporting

Use:

- elegant reports
- dashboards
- statement visuals
- analytical layouts

Avoid:

- tax-season cliché paperwork piles

## Recommended Workflow

1. Generate **one** image first for the category.
2. Check if it matches the family quality and has a distinct mood.
3. Only then generate the rest of that category.
4. If outputs become too similar, explicitly add in the prompt:
   - “with a distinct mood from the other cards”
   - “avoid the same dark chart-dashboard look”
   - “do not resemble the other thumbnails in palette or composition”
5. Save final selected assets under:
   - `agm-hub/public/assets/resource-center/<section>/`

## Naming Convention

Use short stable names:

- `deposit.png`
- `withdraw.png`
- `link.png`
- `from-wise.png`
- `to-wise.png`
- `internal-same-banks.png`

For future sections:

- `manage-trading-permissions.png`
- `options-permissions.png`
- `market-data.png`
- `transfer-positions.png`

Keep names descriptive but short.

## Example Prompt

```text
Use case: stylized-concept
Asset type: website guide carousel card for a Resource Center banking section
Primary request: create a premium thumbnail image for the guide "How to withdraw funds from your account" with its own mood and palette
Scene/backdrop: elegant outbound banking transfer scene, secure account releasing funds, motion moving away from a protected financial platform
Subject: withdrawal concept, outbound money transfer, polished bank/payment UI, secure release of funds
Style/medium: high-end finance editorial illustration, premium website-thumbnail quality
Composition/framing: wide 16:9 landscape composition, strong focal center, clean framing
Lighting/mood: confident and controlled, slightly more dramatic than the deposit image
Color palette: warm amber, coral, copper, soft graphite, restrained cream highlights
Materials/textures: glossy glass panels, subtle metallic accents, soft reflections
Constraints: no text, no logos, no watermark, no people, no clutter
Avoid: same teal palette as deposit, generic dark chart dashboard, crypto imagery, cartoon style
```

## Final Check Before Saving

Before accepting a generated image, check:

- Does it fit 16:9 well?
- Does it read clearly at card-thumbnail size?
- Is it visually different from sibling cards?
- Does it still feel like the same site family?
- Is there any hidden text, numbers, or fake branding?

If yes, save it to the section asset folder and wire it in the relevant `resource-center.ts` slide entry.
