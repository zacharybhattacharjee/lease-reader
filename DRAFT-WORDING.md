# Draft wording for Step 9

Status: **unverified.** Claude wrote all of this for Zachary to check. Nothing here is on the page yet.

How to review it:
- Change anything you want, right in this file, or tell me the changes.
- Pay the most attention to the word meanings. They are legal content, and the testers will rely on them.
- Once you approve a section, I copy it into `content.json` and build that part. Until you've checked each draft, its field name stays in a new `unverified` list in `content.json`. You delete a name when you've checked it.

---

## 9a. What the tool does, and each version

Approved on 10/26 and copied into `content.json`. Each field is named in the `unverified` list there until you check it on the page.

### The intro at the top of the page (`page.intro`, replaces the current one)

Now: "These are three ways to show the same part of a commercial lease. Look at each one."

> Before you sign a commercial lease, you need to know two things: what you can ask to change, and what can cost you the most. This tool finds key clauses in a lease and shows them three ways. Look at each one.

### The upload screen intro (`page.uploadIntro`, replaces the current one)

Now: "Upload a commercial lease as a PDF. The tool finds the key clauses and shows them three ways."

> Upload a commercial lease as a PDF. The tool finds the key clauses and shows them three ways. It works with the Greater Boston Real Estate Board standard form, or a lease that uses the same wording.

### The privacy note (`page.privacyNote`, replaces the wrong one)

Now: "Your lease is sent to Anthropic's AI service to be read. This tool does not keep a copy." This is no longer true, so the page leaves it off today.

> Your lease stays on this computer. The tool reads it here and does not send it anywhere or keep a copy.

### One line under each version heading (new `description` on each version)

These describe what's on the screen, without saying which version is better, so they don't steer testers. Each line stays with its version when `?order=` changes the numbers.

| Version | Line |
| --- | --- |
| A (as written) | The key clauses, word for word as the lease writes them. |
| B (plain language and marks) | The same clauses as the lease writes them, with plain-language notes, a risk number, and what to ask the landlord. |
| C (most serious first) | Short cards, starting with the clause that can cost you the most. Open a card to see the plain-language notes and the lease text. |

### The Version 3 card button (`page.showDetails` and `page.hideDetails`, new)

The cards now say "Show the lease text", but the button also opens the plain-language notes.

> Show the details

> Hide the details

## 9b. Home button

The "Clause & Effect" name at the top becomes the button, so there's no new visible wording. Screen readers hear the name, then this:

| Field | Wording |
| --- | --- |
| `page.homeLabel` | Back to the start |

## 9c. Tap a word to see what it means

### The hint shown above the lease text (`page.glossaryHint`)

> Tap an underlined word to see what it means.

### The word list (`glossary`)

Each entry has the words as the lease writes them, and a meaning. Only the first time a word appears in each clause gets an underline, so the lease text doesn't turn into a sea of dotted lines. All 23 come from the three clauses on the page.

**Who's who and what's rented**

| Lease words | Meaning |
| --- | --- |
| LESSOR | The landlord: the owner who rents the space to you. |
| LESSEE | You, the tenant: the business renting the space. |
| leased premises | The space you are renting. |

**6B. Operating cost escalation**

| Lease words | Meaning |
| --- | --- |
| additional rent | Money you owe on top of your base rent. The lease counts it as rent. |
| operating expenses | The landlord's costs of running and keeping up the building and its land. This section lists what counts. |
| capital expenditure | Money spent on a lasting improvement to the building, such as a new boiler or roof. |
| amortized | Spread out over several years. You pay a yearly share, not the whole cost at once. |

**13. Assignment and subleasing**

| Lease words | Meaning |
| --- | --- |
| assign | Hand your lease over to another business, which takes your place as tenant. |
| sublet | Rent some or all of your space to another business while you stay the tenant. |
| prior written consent | Permission in writing, which you must get before you act. |
| Notwithstanding | Even so. Here: even if the landlord says yes. |
| liable | Legally responsible. If someone else doesn't pay, you must. |
| covenants | Promises you make in the lease. |

**19. Default and bankruptcy**

| Lease words | Meaning |
| --- | --- |
| default | Failing to do something the lease requires, such as paying rent on time. |
| written notice | A written message from the landlord about a problem. Your time to fix it starts from the notice. Section 20 says when a notice counts as delivered, which can be when it is mailed. |
| insolvent | Unable to pay your debts as they come due. |
| for the benefit of creditors | Handing your business property to someone who sells it to pay the people you owe. |
| re-enter and take complete possession | Come back into the space and take it back from you. |
| effects | Your belongings in the space, such as furniture, equipment and stock. |
| without prejudice to any remedies | Without giving up any of the landlord's other ways to get paid. |
| arrears | Money that is overdue. |
| indemnify | Pay someone back for a loss. Here, you pay the landlord back for the rent it loses. |
| residue of the term | The time left on the lease. |

**Check these closely:**
- **written notice.** The meaning points to section 20, because that's where the form says when a notice counts as served. Check that you're comfortable with "can be when it is mailed".
- **re-enter and take complete possession.** This gives only what the words mean. It doesn't say whether Massachusetts law limits how a landlord can do it. Decide whether testers need that.
- **additional rent.** "The lease counts it as rent" is how I read the words "additional rent hereunder". Check it against your reading of the form.

## 9d. What to do next

A box at the end of Versions 2 and 3 that gathers every ask on the page into one list.

| Field | Wording |
| --- | --- |
| `page.nextStepsTitle` | What to do next |
| `page.nextStepsIntro` | Here is every ask on this page in one list. Before you sign, send it to the landlord in writing, and keep a copy. |
| `page.printButton` | Print this list |

The asks themselves come from `clause-types.json`, as they do now. I didn't write new asks.

---

## Still yours to decide

- **9e. Translate.** I left it out, as you asked. It waits until after testing.
- **Who does the asking.** "Send it to the landlord" leaves out a lawyer or broker, as question 12 in the first plan suggested. Watch whether testers ask "who?".
