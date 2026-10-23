# Build plan: Lease reader prototype

Status: draft for Zachary to review. No page code is written yet.

## What we are building

One web page for a live class demo. You upload the standard form lease PDF, and the page shows its key clauses in three versions: "Version 1", "Version 2" and "Version 3".

- **No AI.** The page reads the PDF on your own computer, in the browser. The PDF is never sent anywhere or saved.
- **How it finds clauses.** For each clause, `content.json` lists the first and last words of the excerpt. The page finds those words in the PDF and shows the text between them, exactly as the PDF has it.
- **Where everything else comes from.** The plain-language lines, card lines and types come from `content.json`. The ranks and asks come from `clause-types.json`.
- **The limit.** It works for the GBREB Standard Form Commercial Lease, or a lease using the same wording. Say so when you demo it.

## What I found in your PDF

- It has 4 pages, and the text can be selected, so a browser can read it.
- Sections 6B, 13 and 19 are all there. The form also has 6A (tax increases) and 23 (condition of the premises), which match two of your types: `taxes` and `condition`.
- The margin headings, such as "13. ASSIGNMENT – SUBLEASING", come out apart from the section text. That's why the page searches for the section's own words, not its heading.
- Some words are split across lines with a hyphen ("mate-rials"), and the (a), (b), (c) labels in section 19 come out out of order. The page handles the hyphens. The excerpts should start after those labels.
- The blanks in this copy are empty, so excerpts show gaps where the form says "fill in".

## Questions for you before I start

Each question has my suggestion. Say yes, or tell me what you want instead.

1. **The privacy note is now wrong. You need to rewrite it.** `page.privacyNote` says the lease is sent to Anthropic's AI service, and that's no longer true. Suggestion: something like "Your lease stays on this computer. The page reads it here and does not send or keep it." Until you change it, I leave the note off the page.
2. **The words that find each clause.** In step 0, I'll copy suggested first and last words for 6B, 13 and 19 from your PDF. You approve them, and I add them to `content.json`, with new fields such as `findStart` and `findEnd` on each clause.
3. **Add 6A and 23?** They'd show tax increases and the condition of the space. Suggestion: not for the first build. You'd have to write their plain-language lines first, and three clauses are enough to test the idea.
4. **When the uploaded text differs from the standard form.** This matters for your design question: if a lease was negotiated, your prepared plain-language lines may no longer fit. Suggestion: once you paste the standard excerpt into a clause's `legalText`, the page compares it with the uploaded text. If they differ, it shows `page.excerptWarning`. The current wording ("The quoted text did not match the lease word for word") would need a small rewrite to fit.
5. **pdf.js, Mozilla's free PDF reader.** The page needs it to read PDFs. Suggestion: load it from a public code library (cdnjs) at a fixed version. The other choice is to copy its files into the repo, so the demo doesn't depend on that site.
6. **Fonts.** Google Fonts sets no cookies, but each visitor's browser asks Google for the font files, so Google sees their IP address. Suggestion: use Google Fonts as `CLAUDE.md` says.
7. **Tester label in the footer.** `content.json` has no label word for it, such as "Tester:". Suggestion: show the code alone, small, after the footer line (for example "R1").
8. **The button on Version 3 cards.** The only button words in the file are `showLeaseText` and `hideLeaseText`, which don't mention the plain-language lines. Suggestion: you add `page.showDetails` and `page.hideDetails` with your wording. Until then I use the two that exist.
9. **Where the notes at the top go.** Suggestion: Versions 2 and 3 show `governsSample`, then `youMeans`, then the risk scale line (`tags.consequence.scale`). Version 1 (A) shows none of them, since it has no explanations.
10. **Plain-language color.** Slate text on a slate tint would likely fail the contrast rule. Suggestion: plum text on a light slate tint, with a slate bar down the left edge.
11. **A clause whose `type` isn't in `clause-types.json`.** Suggestion: show it with no risk mark and no negotiable tag. In Version C it goes last.
12. **Who does the asking.** The negotiable wording now says when ("before you sign"), how ("in writing") and whom ("the landlord"). It doesn't say a lawyer or broker can ask for you. Suggestion: leave that out, and watch whether testers ask "who?".

## How the page works, in plain words

1. **Upload screen:** the title, intro, a "Choose a lease" button and "Use the sample lease instead". These words all come from `content.json`.
2. **Reading:** after you choose the PDF, the page shows `page.reading` while it reads. That should take seconds.
3. **Results:** the three versions, with the lease text taken from your PDF. Clauses it couldn't find are listed under `page.notFoundTitle`. A button (`page.startOver`) goes back to the upload screen.
4. **Order:** the page sorts clauses by your ranks in `clause-types.json`. Risk numbers count only the clauses shown, so the sample gives 1 Highest risk (defaults), 2 High risk (subletting) and 3 Moderate risk (building costs).
5. **Hidden fields:** note fields such as `status` and `legalTextNote` never show. Neither does `page.governs`, which says an AI wrote the explanations.

## Steps

I stop after each step so you can check it. Once you say it's right, I commit it and push it to GitHub.

To look at the page on your Mac, run this in the project folder, then open http://localhost:8000. Opening `index.html` directly won't work.

```bash
python3 -m http.server 8000
```

I check every step at phone width and laptop width before handing it to you.

### Step 0: Test reading your PDF (nothing added to the page)

- **What I do:**
  - Use pdf.js in my own browser window to read your PDF, and check that it finds 6B, 13 and 19.
  - Check what happens with blanks that are filled in. If filled-in blanks don't come through, I tell you before we go further.
  - Suggest the first and last words for each excerpt (question 2).
  - Add `*.pdf` to `.gitignore`, so a lease PDF can't be committed by accident.
- **What you check:** you approve the excerpt words. If the test fails, we rethink before building anything.

### Step 1: Page frame, colors and type

- **What I build:** the cream background, plum text, the two fonts, the title and intro, and the footer.
- **What you check:** the page looks calm and finished on your phone and laptop.

### Step 2: Version A (as written)

- **What I build:** each clause's heading and lease text, in lease order, on a white panel that looks like a document. This uses the sample content for now. Clauses with no lease text show `[Lease excerpt goes here]` in gray.
- **What you check:** it reads like the lease itself.

### Step 3: Version B (plain language and marks)

- **What I build:** the clauses in lease order, with plain-language lines, the risk mark (for example "1 Highest risk"), the "Ask before you sign" tag, the asks, and the notes from question 9.
- **What you check:** you can tell at a glance what to push on and what costs the most.

### Step 4: Version C (most serious first)

- **What I build:** short cards ordered by risk, each with its short heading, card line, risk mark, "why" line, tag and asks. A button opens the plain-language lines and lease text.
- **What you check:** the order makes sense, and opening and closing a card feels clear.

**Until step 5,** the page stacks the finished versions one after another, so you can compare them.

### Step 5: Version switcher and link settings

- **What I build:**
  - The three "Version" buttons. One version shows at a time, and switching scrolls to the top.
  - `?order=`, for example `?order=CAB`. Bad values fall back to "ABC".
  - `?t=`, a short tester code shown in the footer.
- **What you check:** try `?order=CAB&t=R1` and `?order=XYZ`, and switch versions using only the keyboard (Tab, then Enter).

### Step 6: Upload screen and reading the PDF

- **What I build:** the upload screen, the reading message, filling the lease text from your PDF, the "Not found" list, the error message, the start-over button, and the sample-lease button.
- **What you check:**
  - Upload your standard form PDF and confirm every excerpt is right.
  - Try a PDF that isn't the form, and a scanned PDF if you have one.

### Step 7: Put it on GitHub Pages and rehearse the demo

- **What happens:** GitHub Pages has to be turned on for `lease-reader`, which changes a repo setting. I'll ask before I do it, or you can do it yourself in Settings, under Pages. Then we test the live link on the laptop and browser you'll use in class.
- **For demo day:** keep the PDF on the laptop's desktop, not only in OneDrive. "Use the sample lease instead" is your backup if anything goes wrong.

## What the page will not do

- No AI, and no server.
- No sending or saving uploaded files.
- No analytics, cookies or saved tester data.
- No tester names anywhere, including commit messages.
- It won't understand leases that use different wording. It finds only the clauses written the way the standard form writes them.
- No changes to wording in the JSON files unless you ask.
