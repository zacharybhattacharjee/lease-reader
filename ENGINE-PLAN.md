# Plan: the lease-reading engine

Status: draft for Zachary to review. Nothing in this plan is built. The questions are at the end.

## What the engine does

Today the page finds 3 clauses by copying their first and last words from the standard form. The engine reads the whole lease instead, and sorts every section into a library of clause types you write ahead of time.

For each section of an uploaded lease, it does six things in order:

1. **Reads** the text from the PDF, and remembers where each line sits on the page.
2. **Splits** the lease into sections, using the section numbers and headings.
3. **Sorts** each section into a clause type, such as "default" or "subletting", by matching complete phrases from the library.
4. **Picks the version** of that clause the lease uses, such as "you get written notice and time to fix it" or "no notice".
5. **Fills in numbers** such as days, dollars and percentages, but only where the wording around the number matches a version you wrote (stage 2).
6. **Flags** warning phrases and defines legal phrases across the whole lease (stage 3).

The engine never writes a sentence. It only chooses sentences from the library and, in stage 2, puts the lease's own numbers into the blanks you left for them.

## The rules this plan follows

These are your rules from the request. Each is built into the plan as described below.

- **No AI, no outside services, nothing paid. It runs on GitHub Pages.** The engine is plain JavaScript running in the browser, reading plain library files. See question 1 about the two outside files the page already loads.
- **The lease never leaves the computer.** As today. The test tool (stage 4) also runs only in the browser.
- **The page never writes its own sentences.** Every sentence comes from a library file.
- **The library is kept apart from the code.** It sits in its own `library/` folder (see "Files").
- **The lease's own words sit next to every explanation.** That includes "not sorted" and "unsure" sections.
- **A filled-in number is highlighted where it came from.** The sentence in the lease text that the number came from is marked, so the owner can check it.
- **When unsure, the tool says so and never guesses:**
  - Matches no type: "not sorted", shown with its glossary words defined.
  - Matches two types: shows both, and says it's unsure.
  - Matches a type but no version: shows the type's general information, the lease text, and a line saying it couldn't tell which version this is.
- **Warning phrases match by their complete wording,** and are not raised when a "not" comes just before them (stage 3).
- **No text to read means stop.** If the PDF has no selectable text, the page shows `page.error` (it already says to use a PDF where the text can be selected). It never tries to read scanned pages.
- **New asks, and anything mentioning the CBC, go in `DRAFT-WORDING.md` first.** The same applies to every new owner-facing sentence, as `CLAUDE.md` already requires.

## What I tested in your PDF

- **The standard form splits cleanly.** Every section heading sits in the left margin, apart from the section text. That gives a clean list of all 27 sections, plus the lettered parts 6A, 6B, 6C, 11A and 11B. The page can use that margin to split the form, without guessing.
- **Other leases won't have that margin.** Most put the number and heading at the start of the paragraph ("13. ASSIGNMENT AND SUBLETTING. Tenant shall not…"), or use "Section 13" or "Article IV". The splitter needs rules for those too, plus rules to skip a table of contents and repeated page headers and footers.
- **I only have one real lease.** `.test-pdfs` has the standard form, a one-page residential sample, a broken file and a scanned file. I can't test the splitter on a second commercial lease until you add one (question 3).

## Files

The library is what Darryl reviews. The code is what I write. They stay apart.

| File | What's in it | Who writes it |
| --- | --- | --- |
| `library/clause-types.json` | Today's `clause-types.json`, moved, plus new types. Each type gets trigger phrases that identify it. | Ranks: you. Asks: Darryl reviews. Triggers: me, you check. |
| `library/versions.json` | For each type, the common ways it's written. Each version has cue phrases, a plain-language sentence, and (stage 2) a sentence with blanks for numbers. | Sentences: drafted in `DRAFT-WORDING.md`, then reviewed. Cues: me. |
| `library/glossary.json` | Legal words and phrases and their meanings. Starts with the 23 from step 9c. | Drafted, then reviewed. |
| `library/warnings.json` | Warning phrases, what each one means for the owner, and how it changes the risk mark. | Drafted, then reviewed. |
| `library/missing.json` | What to say when the lease seems to have no section of a type, such as no cure period. | Drafted, then reviewed. |
| `content.json` | Page wording, as today. The 3 sample clauses stay for "Use the sample lease instead". | You. |
| `engine.js` | The engine: read, split, sort, pick, fill, flag. | Me. |
| `app.js` | Draws the page, as today. | Me. |
| `test.html`, `test.js` | The test tool (stage 4). Not linked from the main page. | Me. |

JSON files are readable, but they're still code-shaped. Question 2 asks whether Darryl should get a plain review page instead.

## How sorting decides (plain version)

- Each clause type lists **trigger phrases**. These are complete phrases, never single words. For subletting, for example: "assign or sublet", "prior written consent". The section heading counts too, such as "ASSIGNMENT".
- A section is **sorted** into a type when it matches enough of that type's phrases, and clearly more than any other type.
- When two types both match well, the section is **unsure**, and the page shows both.
- When nothing matches well enough, the section is **not sorted**.
- I set the first "enough" and "clearly more" numbers from the standard form. The test tool records how well they work before anyone changes them (stage 4).
- **Lettered parts:** a lettered part with its own heading (6A, 6B, 6C) is sorted on its own. Lettered items inside one sentence, such as 19 (a), (b) and (c), stay with their section.
- **Riders and exhibits:** anything after section 27 headed "Rider", "Exhibit" or "Addendum" becomes its own section. If a rider names another section ("Section 13", "paragraph 13"), the page shows a line by that section saying a rider may change it, and links the two. It never decides which one governs. That line is new wording, so it goes through `DRAFT-WORDING.md`.

## The stages

I stop after each stage so you can check it. Before each stage, I put that stage's new sentences in `DRAFT-WORDING.md` for you and Darryl. I build after you approve them.

### Stage 1: More clauses, each with a few versions

- **What I build:**
  - The engine's first three parts: read, split and sort, plus picking the version.
  - The library files, with the first batch of new clause types from the form (question 5), and two to four versions of each.
  - The page shows each sorted section in the versions, with "not sorted" and "unsure" sections shown as described above. How that looks is your call (question 7).
- **What's drafted for review first:** each new type's name, "why" line, asks and suggested rank, and each version's plain-language sentence.
- **Versions in this stage have no numbers.** For example: "The landlord must warn you in writing and give you time to fix the problem." The numbered versions come in stage 2.
- **What you look at:**
  - Upload the standard form. Every one of the 27 sections, plus 6A to 6C and 11A and 11B, is listed as sorted, unsure or not sorted.
  - Check each sorted one against the form. Check that "unsure" and "not sorted" sections still show the lease text.
  - Try the residential sample. Almost everything should be "not sorted", and nothing should be guessed.

### Stage 2: The lease's own numbers in the plain-language lines

- **What I build:**
  - Number finders for days, dollar amounts, percentages and dates.
  - They read numbers written twice ("ten (10) days") and check the two agree. If they don't agree, the number isn't filled in, and the page says to check it.
  - They read phrases like "whichever is greater" and "one and one-half percent (1.5%)".
  - A number is filled in only when it sits inside a version's cue phrase, such as "within {days} days after written notice". A number anywhere else is ignored.
  - The sentence the number came from is marked in the lease text. How the mark looks is your call (question 8).
- **Blanks:** your copy of the form has empty blanks, such as the percent in 6B. When a blank is empty, the page uses a "the lease leaves this blank" sentence from the library instead. That's new wording, drafted first.
- **What you look at:** upload the form and a filled-in lease. Every filled-in number matches the marked sentence. An empty blank shows the "left blank" sentence, not a made-up number.

### Stage 3: Warning phrases and glossary meanings across the whole lease

- **What I build:**
  - **Warning phrases,** such as "sole discretion", "waives", "without notice", "personally" and "all remaining rent". Each is matched by its complete wording, in every section, sorted or not.
  - **The "not" check:** a warning isn't raised when "not", "no", "never" or "nor" comes within a few words before it, in the same sentence. So "shall not be unreasonably withheld" isn't flagged. The library can also list the owner-friendly phrase itself ("not be unreasonably withheld"), which the page can point out as good news.
  - **The glossary across the whole lease,** using the tap-a-word feature from step 9c. Each word is underlined the first time it appears in each section.
  - **Missing-clause checks** (question 9). The wording says "The tool didn't find…", never "This lease has no…", because the tool may have missed it.
- **What you look at:**
  - A warning phrase raises its clause's risk mark.
  - The same phrase with "not" before it doesn't.
  - Glossary words work in "not sorted" sections too.
- **One limit to know:** the "not" check catches "not" and similar words, but not every way of flipping a meaning, such as "except" or "unless". The test tool will show how often that matters.

### Stage 4: The test tool

- **What I build:** a separate page, `test.html`. You choose a lease PDF and its answer key, and it reports how each section was sorted:
  - **correct:** the right type
  - **wrong:** a different type
  - **unsure:** two types shown, with or without the right one
  - **not sorted**
  - **missed:** in the answer key, but the splitter never found that section
  
  It gives one score: correct sections divided by sections in the answer key. "Unsure" never counts as correct.
- **The answer key** is a simple two-column file you make in Numbers or Excel and save as CSV. It has a section number and a clause type on each row, such as `6B,operating_costs`, and no lease text.
- **Recording the first run:**
  - A "Save this report" button saves a report file to your computer.
  - The report has the date, the lease's file name, the scores, and a short code that changes whenever the library files change. So you can tell which rules a run used.
  - Your first saved report is the starting point. Later, you choose an old report next to a new run, and the tool shows what got better or worse.
- **Unseen leases:** keep one lease aside that I never use to write rules, so its score is a fair test (question 4).
- **What you look at:** run the standard form with its answer key, and save the first report before any rules change.

## What else this changes

- **`CLAUDE.md`:**
  - The "Reading an uploaded lease" section is rewritten for the engine.
  - The "Done means" line about replacing clauses in `content.json` becomes the library files.
  - I'll show you the new wording before changing it.
- **Step 9:** finishing 9c first saves work, because stage 3 reuses its tap-a-word feature. 9d's "What to do next" list grows on its own as more clauses are sorted.
- **Step 8 (whole lease view):** the engine keeps where each line sits on the page from stage 1. So the whole-lease highlights can mark every sorted section later, not just three.
- **Versions 1 and 2** will list many more clauses. Version 3's layout for 10 or more cards is your decision (question 6).

## Questions for you

1. **Two outside files.** The page loads pdf.js from cdnjs and the fonts from Google Fonts. Neither ever sees the lease, but each visitor's browser contacts both sites. To follow "no outside services" strictly, I'd copy both into the repo (pdf.js is free to copy). Do you want that?
2. **A review page for Darryl.** Should I build `review.html`, a plain page listing every sentence in the library by clause type, so Darryl never opens a JSON file? It adds a page, and its look is your call.
3. **Test leases.** Please put your other commercial leases, such as the Egleston lease, in `.test-pdfs` (git ignores it, so they're never committed). How many can you get? Three or four commercial leases is the minimum for a fair score.
4. **The unseen lease.** Which lease should I never look at while writing rules, so its score is a fair test?
5. **Which clauses first.** Today's types cover 6A, 6B, 13, 19 and 23, plus a personal guaranty, which the form doesn't have but riders often add. My suggested first batch from the form:
   - 5 security deposit
   - 11 maintenance
   - 12 alterations
   - 16 indemnification
   - 17 liability insurance
   - 18 fire, casualty and eminent domain
   - 21 surrender
   - 25 late charge
   - 26 liability of owner
   
   The rest (parties, premises, term, rent, utilities, use, notice and so on) would show as sorted but low risk, or not sorted. Do you agree? And should I draft suggested ranks and levels for you to change, or do you want to set them from scratch?
6. **Version 3 with 10 or more cards.** You said you'd decide this. Some options: show the top few with a "show more" button, or group the cards by risk level.
7. **How "unsure" and "not sorted" sections look, and where they go.** In each version, or in one list at the end like "Not found in this lease" today?
8. **How the "number came from here" mark looks.** For example, the same gold highlighter, or an underline.
9. **Missing-clause checks.** Your stage list doesn't name them. Should they go in stage 3?
10. **What a warning phrase does to the risk mark.** Suggestion: it moves the clause up one level (moderate to high, high to highest), and the warning shows its words. Or should it only show the warning and leave the rank alone?
11. **Test tool order.** You asked for the first run to be recorded before any rules change. A basic version of the test tool in stage 1 would record how well sorting does before I tune anything. Then stage 4 adds the comparison and the saved reports. Do you want that, or keep it all in stage 4?
12. **Where saved reports live.** Reports hold only section numbers, types, scores and the file name. Should they go in a `test-results/` folder in the repo? If a lease's file name says whose lease it is, I'd leave the name out.
13. **The sample lease button.** Keep it showing today's 3 sample clauses, or retire it once real uploads work well?
