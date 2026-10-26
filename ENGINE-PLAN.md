# Plan: the lease-reading engine

Status: draft for Zachary to review. Nothing in this plan is built. The questions are at the end.

Version 2 (10/26). The library now comes from your workbook, `clause-library.xlsx`, and follows the rules in `RESEARCH-BRIEF.md`. The section "What I checked in your files" lists problems I found in both.

## What the engine does

Today the page finds 3 clauses by copying their first and last words from the standard form. The engine reads the whole lease instead, and sorts every section into the library you build in the workbook.

For each section of an uploaded lease, it does six things in order:

1. **Reads** the text from the PDF, and remembers where each line sits on the page.
2. **Splits** the lease into sections, using the section numbers and headings. Riders, exhibits and amendments count as part of the lease.
3. **Sorts** each section into a clause type by matching its trigger phrases.
4. **Finds every version** of that clause the section matches. A section can match more than one, such as a friendly version followed by "provided, however" taking it back.
5. **Fills in numbers** from the lease, but only where it's sure (stage 2).
6. **Flags** warning phrases, defines glossary phrases, and checks for missing protections (stage 3).

The engine never writes a sentence. It only chooses sentences from the library, and in stage 2 puts the lease's own numbers into the blanks in braces, such as `{days}`.

## The rules

These come from your engine request and from `RESEARCH-BRIEF.md`:

- **Everything runs in the owner's browser.** No AI, no outside services, nothing paid. It keeps working on GitHub Pages. The lease never leaves the computer.
- **Every sentence comes from the library.** The page never writes its own.
- **The library sits apart from the code,** and the workbook is its source (see the next section).
- **The lease's own words sit next to every explanation.**
- **Filled-in numbers are traceable.** When a number is filled in, the sentence it came from is highlighted in the lease text.
- **Never guess:**
  - A section that matches no type is "not sorted", shown with its glossary meanings.
  - A section that matches two types shows both, and says the tool is unsure.
- **Riders:** if a rider and a main clause match the same type, both show, with a line saying the rider may change the main clause.
- **Warning phrases match by their complete wording,** with a check for "not" nearby.
- **No scanned pages.** If a PDF has no selectable text, the page tells the owner to use one where the text can be selected.
- **You set every tier.** The engine leaves blank tiers blank and shows "Tier not set". I never suggest one.
- **New text goes in `DRAFT-WORDING.md` first.** That covers asks, and any wording that mentions the CBC.
- **Some things never go in the repository:**
  - text from Practical Law, Westlaw, Lexis or MCLE
  - the Egleston lease, or any text from it
  - the lease research dataset
- **Never invent a real example.** Each one is copied from a real lease and names its source.
- **The page never says a clause is void.** At most: "Massachusetts law may limit this clause. Ask a lawyer."
- **No points, streaks, timers, lease scores, or quizzes on the owner's own lease.**

## Where the library comes from: your workbook

The workbook is the one place you write and approve the library. The page can't read a spreadsheet without adding outside code, so a small converter turns it into library files the page can read.

1. **You edit `clause-library.xlsx`** and set each row's status.
2. **The converter reads the workbook,** checks it, and writes the library files. It's a short script that uses only what's already on a Mac, so nothing gets installed. I run it whenever you send a new workbook, or you can run it with one command.
3. **The converter also checks each row,** and lists any problems instead of guessing:
   - a blank in braces with no matching number to fill
   - a version whose clause type doesn't exist
   - an answer-key row naming an unknown type
   - two rows with the same ID
4. **The page reads only the library files.** Change the workbook, run the converter, and the page changes with no code change.

**What reaches the page:**

- **The live page uses approved rows only.** Which status counts as approved is question 1.
- **Preview mode shows draft rows too.** You turn it on with a link setting, such as `?preview=1`. Everything shown only because of preview carries a "Draft" label. Testers never see preview unless you send them that link.
- **Draft rows also go in `DRAFT-WORDING.md`.** The converter writes them there as a readable list, so you don't copy anything by hand.

**What each sheet becomes:**

| Sheet | Library file | Notes |
| --- | --- | --- |
| Clause types | `library/clause-types.json` | Replaces today's `clause-types.json` (question 2 covers how tiers replace the current ranks). |
| Versions | `library/versions.json` | The "real example" and "source" columns stay in the workbook. The page doesn't show them. |
| Warning phrases | `library/warnings.json` | |
| Glossary | `library/glossary.json` | |
| Missing clauses | `library/missing.json` | |
| Answer key | Read by the test tool (stage 4) | Answer keys stay on your computer, never in the repository. |
| Sources, EDGAR leases found, Lease dataset red flags | Not turned into files | Reference only. The dataset sheet holds research-dataset text, so the workbook itself stays out of the repository (question 3). |

The code files: `engine.js` (the engine), `app.js` (draws the page, as today), `test.html` and `test.js` (the test tool), and `tools/convert-workbook.py` (the converter).

## What I checked in your files

**Real examples.** I opened 5 of the EDGAR filings (Mandiant, Pulmonx, Carbon Black, Phreesia and Boston Restaurant Associates) and searched each one for its quoted example.
- All 5 quotes are really there. One differs only by a curly apostrophe ("month’s").
- 4 links don't open, because they end in `.txt/seq-2` or `.txt/seq-6`: ON Technology, Sensus Drug Development, WatchGuard and Boston Restaurant Associates. For Boston Restaurant, the same link without the `/seq-2` ending opens the whole filing, and the quote is there.
- I didn't check the rest. I'll check every example before it goes live.

**Blanks the engine can't fill yet.** Your rule says a number is filled in only when it's found inside the version's own wording.
- Only 2 versions have that today: `default-notice-and-cure` and `relocation-limited` have `{days}` inside a cue phrase.
- The other 13 versions with blanks would show their sentence without the number until their cue phrases get matching blanks, for example `default-extended-cure`, `guaranty-capped` and `opex-capped`.
- Cue phrases are matching rules, not sentences owners read. So in stage 2 I'd draft the missing ones for you to check.
- One mismatch: `opex-base-year` lists `share` as a number to fill, but its sentence has no `{share}`.

**Warning phrases that will misfire if matched as written:**
- "as is" also matches "such portion as is necessary". It needs a rule that it stands alone.
- "waiver" (listed under "hereby waives") also matches "waiver of subrogation", which your glossary treats as normal insurance language.
- "sole discretion" can be the *tenant's* discretion, which is friendly. The engine should check whose discretion it is.
- "personally" and "reasonable" already have notes. The engine follows them.

**Trigger phrases that are single common words.** "Term", "sign", "notice", "repair", "access", "remove", "transfer", "default" and "cure" appear all through a lease. Matched everywhere, they'd make many sections look like several types at once. I suggest single words count only in a section's heading, and longer phrases count anywhere (question 6).

**Missing-clause wording sounds certain.** For example, "This lease doesn't give you a right to renew." But the tool might have missed the clause, and your rule says it must say when it isn't sure (question 7).

**The dataset sheet:**
- It says "U.S.-style leases only", but some rows use British wording ("undertenant… covenanted by deed", "Service Charge"). The `no-early-exit` example comes from a lease the sheet itself calls foreign.
- The `subordination-only` source cell points to a dataset label called `change_of_control`, which is a different topic.
- The brief says 36 U.S.-style test leases, but the Sources sheet says about 53.

**Darryl.** The brief, the "How to use" sheet and the Sources sheet say rows go live only when "Approved by Darryl", and that Darryl reviews every sentence. You told me Darryl gives feedback on the interface only. I haven't followed that part of the brief (question 1).

**Small wording notes,** for you to decide, since the wording is yours:
- "Hold harmless: Promise not to blame someone…" might read better as "Promise not to hold someone responsible for a loss, and to cover it."
- Your 23 word meanings from step 9c (LESSOR, LESSEE, covenants and so on) aren't in the Glossary sheet yet (question 8).

## How sorting decides

- **Each clause type lists trigger phrases.** A section is sorted into a type when it matches enough of them, and clearly more than any other type.
- **Two types both match well:** "unsure", and both show.
- **Nothing matches well enough:** "not sorted".
- **The section heading counts extra.** "ASSIGNMENT" is strong evidence.
- **Versions:** the engine checks every version's cue phrases against the whole section, never stopping at the first match, and shows every version that matches. Cue phrases with "…" in them, such as "Landlord may … terminate this Lease", allow a few words in between.
- **Lettered parts with their own heading** (6A, 6B) are sorted on their own. Lettered items inside one sentence, such as 19 (a), (b) and (c), stay with their section.
- **Riders:** if a rider matches the same type as a main clause, or names it ("Section 13"), both show, with the "may change" line. The engine never decides which one governs.
- **Defined terms:** capitalized terms like "Additional Rent" are linked to where the lease defines them, when the engine can find the definition, for example in a Definitions section or after the words "(the "Premises")". If it can't find one, there's no link, and nothing is guessed.
- **The "enough" and "clearly more" numbers** start from the standard form, and the first test run is recorded before anyone changes them.

## Numbers the engine reads (stage 2)

From the brief. In every case, if the engine isn't sure, it shows the sentence without the number and points to the lease's own words.

- **Words and digits together,** such as "ten (10) days". The two must agree, or nothing is filled in.
- **Business days.** "Ten (10) Business Days" fills `{days}` with "10 business", so the sentence reads "10 business days".
- **Dollars,** such as "$3,000.00" and "Three Thousand Dollars ($3,000.00)".
- **Percentages,** such as "five percent (5%)" and "5% per annum".
- **Choices** ("whichever is greater", "the lesser of"):
  - Both numbers show.
  - The engine says which applies only when it can tell from the numbers themselves.
  - When it depends on facts the lease doesn't give, it says the lease decides, using a library sentence.
- **Index-based amounts** ("increase by the CPI") have no number to fill. The library needs a sentence that says the amount depends on inflation.
- **Dates and years,** such as "Base Year", "Commencement Date" and "2027".
- **Empty blanks,** as in your copy of the standard form. The page uses a "the lease leaves this blank" sentence from the library.

## The stages

I stop after each stage so you can check it.

### Stage 1: Read, split and sort, with the workbook as the library

- **What I build:**
  - The converter.
  - The engine's read, split, sort and version steps.
  - Preview mode.
  - The page shows sorted, unsure and not-sorted sections. How they look is your call (question 9).
- **Scope:** all 32 clause types from the workbook are sorted by their triggers. Versions exist so far for 13 of them. The others show their type's information and "couldn't tell which version" until you add versions.
- **What you look at:**
  - **The standard form with `?preview=1`:** all 27 sections plus 6A to 6C and 11A and 11B are listed, each as sorted, unsure or not sorted, with "Draft" labels. Check each sorted one against the form.
  - **The same link without `?preview=1`:** nothing is approved yet, so no draft sentences appear.
  - **The residential sample:** almost everything should be "not sorted", with nothing guessed.
  - **The converter's report:** read its list of problems in the workbook.

### Stage 2: The lease's own numbers

- **What I build:**
  - The number finders above.
  - Highlighting the sentence each number came from (the look is your call, question 9).
  - Drafts of the missing number blanks in cue phrases, for you to check in the workbook.
- **What you look at:**
  - Every filled-in number matches its highlighted sentence.
  - An empty blank shows the "left blank" sentence.
  - "Ten (15) days" fills nothing and says to check the lease.

### Stage 3: Warning phrases, glossary, defined terms and missing clauses

- **What I build:**
  - **Warning phrases:**
    - Matched by their complete wording across the whole lease, sorted or not.
    - The "not" check means "not", "no", "never" or "nor" a few words before the phrase, in the same sentence.
    - The special cases above: "as is", "waiver", and whose "sole discretion" it is.
  - **Glossary meanings** in every section, using step 9c's tap-a-word feature.
  - **Defined-term links.**
  - **Missing-clause checks,** for each clause type with a row on the Missing clauses sheet.
- **What you look at:**
  - "Shall not be unreasonably withheld" shows as friendly, and isn't flagged.
  - "Such portion as is necessary" isn't flagged.
  - Glossary words work in "not sorted" sections.
  - Missing-clause messages appear only for types the engine really didn't find.
- **A limit to know:** the "not" check doesn't catch every way of flipping a meaning, such as "except" or "unless". The test tool will show how often that matters.

### Stage 4: The test tool

- **What I build:** `test.html`, not linked from the main page. You choose a lease PDF and its answer key, saved from the workbook's Answer key sheet as a CSV file. It reports each section as one of:
  - **correct:** the right type
  - **wrong:** a different type
  - **unsure:** two types shown
  - **not sorted**
  - **missed:** the splitter never found it
- **It gives a type score,** and a version score from the Version ID column. "Unsure" never counts as correct.
- **Reports are saved to your computer.** Each saved report says "first run" or "after tuning", with the date, the scores, and a short code that changes whenever the library changes.
- **Comparing runs:** choose an earlier report alongside a new run, and the tool shows what got better or worse.
- **Which leases are used for what:**
  - I build the rules from the standard form, two or three EDGAR leases, and about two-thirds of the dataset's U.S.-style leases.
  - The rest of the dataset is held back.
  - The Egleston lease is held out entirely. I never see it, and you run it on your own computer with your own answer key.
- **What you look at:** save the first run on the standard form before any rule changes. Later, run the Egleston lease yourself.
- **The honest claim** for your presentation: "it works well on leases like the ones it was built from."

## Not planned: your decisions first

From the brief. I won't build any of these until you choose:

- How Version 3 shows 10 or more cards.
- An ask list the owner builds while reading, kept on their own device.
- Showing what a clause could cost over time, using the lease's own numbers.
- A practice game on the sample lease only, saving nothing.
- A scripted negotiation rehearsal, with every line written ahead of time.

## What else this changes

- **`CLAUDE.md` needs updating** for the engine, the library folder, the converter and preview mode. Today it says drafts appear only in `DRAFT-WORDING.md`, never on the page. Preview mode changes that. I'll show you the new wording first.
- **Step 9:** 9c's tap-a-word feature is reused in stage 3, so building 9c first saves work.
- **Step 8 (whole lease view):** the engine keeps where each line sits, so highlights can later cover every sorted section.

## Questions for you

### Needed before stage 1

1. **Who approves rows for the live page?**
   - The brief and the workbook say "Approved by Darryl", but you told me Darryl gives interface feedback only.
   - Suggestion: "Approved by Zachary" is the final status, and the "Approved by Darryl" option is removed from the workbook.
   - The brief, the "How to use" sheet and the Sources sheet would need the same change. You edit those.
2. **How tiers replace today's ranks.**
   - Today `clause-types.json` has your ranks 1 to 6 and levels like "Highest risk". The workbook has tiers 1 to 3.
   - Do tiers replace the levels, so "Tier 1" becomes the risk mark?
   - Within a tier, what order do clauses go in: lease order, or a rank you also set?
   - What does the page call each tier? That's new wording.
   - Should a version's "tier override" change the clause's place in the order?
3. **Keeping the workbook out of the repository.** It holds research-dataset text, which the brief says is never committed. Suggestion: keep the workbook and the dataset in a folder git ignores, and commit only the library files the converter writes. Is that right?
4. **The research dataset.** Where is it on your computer? Or may I download it from its public source into a folder git ignores?
5. **Preview mode:** is `?preview=1` OK as the link setting?
6. **Single-word triggers count only in headings.** OK?
7. **Missing-clause wording.**
   - Should each sentence say the tool may have missed it?
   - Or should one line above all of them say so, from new wording in `content.json`, such as "The tool didn't find these protections. Check the lease's own words."?

### Can wait

8. **Should your 23 word meanings from step 9c go into the Glossary sheet,** so there's one glossary?
9. **How "unsure" and "not sorted" sections, and the number highlight, look.** Your call before stages 1 and 2.
10. **What a warning phrase does to the tier.** Since you set every tier, suggestion: a warning shows its words and its meaning, but never changes the tier on its own. If you want warnings to raise the tier, say how.
11. **Test tool timing.** A basic test tool in stage 1 would record how sorting does before I tune anything, and stage 4 would add the reports and comparison. Or keep it all in stage 4?
12. **The two outside files.** The page loads pdf.js from cdnjs and the fonts from Google. They never see the lease. Copy them into the repo so the page uses no outside sites at all?
13. **The sample lease button.** Keep today's 3 sample clauses, or retire it once uploads work well?
14. **The broken EDGAR links.** Will you fix the 4 `.txt/seq` links in the workbook, or should I list the full links for you to paste?
