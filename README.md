
# Official.ai

The minimal hub for official announcements from major AI laboratories.
Aggregates ONLY official updates. No noise. No opinions.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Fetch initial data:
   ```bash
   npx tsx scripts/fetch-updates.ts
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Automated Tasks

- **Fetch Updates**: Run `npx tsx scripts/fetch-updates.ts` (Schedule this hourly/daily).
- **Generate Digest**: Run `npx tsx scripts/generate-digest.ts` (Schedule this weekly).
  - Output is saved to `data/digest-week-X.txt`.

## Project Structure

- `src/app`: Next.js App Router pages.
- `src/lib/config.ts`: Configuration of companies and RSS feeds.
- `src/lib/types.ts`: Data models.
- `scripts/`: Automation scripts.
- `data/`: JSON storage (git-ignored in prod, but committed for MVP).

## Design Philosophy
- Signal > Noise.
- Trust > Beauty.
- Black, White, Grayscale. Minimal touches of color only for semantic tags.
