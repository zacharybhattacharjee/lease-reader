# Lease reader prototype

## What this is

A clickable prototype for a Northeastern Law legal design studio. It shows the key clauses of a commercial lease in three versions so testers can compare them.

Design question: How might we redesign small business contracts so that what is negotiable and what is consequential are visible in the document that legally binds?

This prototype tests one thing: can a small business owner tell what to push on, and what can cost them the most? It is a first draft for testing, not a product.

Zachary is not a software developer. Explain every change in plain words, without jargon.

## Files

- `content.json`: every word on the page, and the lease clauses currently shown.
- `clause-types.json`: the risk rank, level, "why" line, and "You can ask" lines for each clause type.
- `index.html`, `style.css`, `app.js`: the page.
- `PLAN.md`: the build plan once Zachary approves it.

To show a different lease, Zachary replaces the `clauses` list in `content.json`. The page must not need any code change when that happens.

## Hosting

The site runs on GitHub Pages from the main branch, root folder. Keep it a plain static site: the files above, in the root, with `index.html` as the start page. No build step, no server, no package installs.

## Rules for the build

- Use plain HTML, CSS, and JavaScript. No framework.
- No AI calls, no analytics, no cookies, no saving tester data. Observers take notes by hand.
- Load all page text from `content.json`. Never hardcode page text.
- Join each clause to its type in `clause-types.json` by the `type` field to get its rank, level, why, negotiable, and asks.
- Never write, edit, or invent lease text, plain-language lines, ranks, or asks. They come only from the JSON files.
- Do not change wording in the JSON files unless Zachary asks. If wording breaks a layout, report it instead of rewording it.
- If a `legalText` field is empty, show `page.emptyExcerpt` in gray.
- Ignore note fields: `status`, `source`, `legalTextNote`, `verified`, `internalName`, `lookFor`.
- Leave out the upload screen for now. Do not build any page text that mentions uploading.

## The three versions

`content.json` defines them under `versions`, using the `shows` list for each.

- A shows the lease text in lease order (`leaseOrder`).
- B shows the lease text in lease order, with the plain-language lines, the "You can ask" tag and asks, and the risk rank.
- C shows short cards ordered by rank, highest risk first. Tapping a card shows the plain-language lines and the lease text.
- B and C show `page.governsSample` at the top, so no one mistakes the explanation for the lease.
- Number risk ranks among the clauses shown, from 1, in the order of `rank` in `clause-types.json`.

## How testers see it

- Testers see "Version 1", "Version 2", "Version 3". Never show A, B, C or the internal names.
- The `order` link setting sets which version is 1, 2, and 3. Example: `?order=CAB` makes C Version 1. Default is `ABC`. Ignore invalid values and use the default.
- The `t` link setting carries a tester label, such as `?t=R1`. Show it small in the footer so notes can be matched. Never use tester names anywhere, including commits.
- One version shows at a time. Switching versions scrolls back to the top.
- The page must make sense without anyone explaining it.

## Look

The page should feel calm, credible, and finished, like a well-designed legal aid site, not a template.

- Colors: cream `#F7F3EA` background, plum `#3B2340` text, slate `#5B7083` for plain language, gold `#C9A227` for "You can ask", brick `#A63A2B` for risk.
- Type: a serif from Google Fonts for headings (Source Serif 4) and a clean sans for body text (Inter), each with a system fallback.
- Lease text looks like a document: slightly smaller, set apart on a white panel. Plain-language lines sit beside or under it on a light slate tint, so the two never blur together.
- Generous spacing. One idea per card. Soft corners and light shadows, nothing loud.
- Color never carries meaning alone. The negotiable tag always says "You can ask". The risk mark always shows the number and level name, such as "1 Highest risk".
- Text meets WCAG AA contrast. Gold is a background only, with plum text on it.
- Design for a phone first (375 px wide), then make sure it looks good on a laptop. Body text at least 16 px. Tap targets at least 44 px.
- Use real headings, real buttons, and `aria-expanded` on anything that opens and closes. The version switcher works with a keyboard and a screen reader.

## How to work with Zachary

- Plan before writing code. Save the plan as `PLAN.md` and wait for approval.
- Build in small steps and stop after each one so he can check it:
  1. The page frame, colors, and type.
  2. Version A.
  3. Version B.
  4. Version C.
  5. The version switcher and the link settings.
- After each step, say exactly what to look at and what changed.
- Ask before adding anything not described here.

## Done means

- All three versions show correctly on a phone and a laptop.
- `?order=` and `?t=` work.
- Replacing the clauses in `content.json` changes the page with no code change.
- It runs on GitHub Pages.
