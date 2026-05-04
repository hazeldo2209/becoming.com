/**
 * Becoming — Post-Test Survey
 * Google Apps Script that:
 *   1) creates a new Google Form with all 25 questions, correctly typed, and
 *   2) submits the 10 persona responses programmatically.
 *
 * HOW TO RUN
 *   1. Open https://script.google.com/  →  New project
 *   2. Paste this entire file into the Code.gs editor (replace the default).
 *   3. Save (⌘/Ctrl + S). Project name: "Becoming Post-Test Form".
 *   4. From the function dropdown, pick:  createBecomingFormAndResponses
 *   5. Click ▶ Run. Approve the OAuth scopes when Google asks
 *      (it needs permission to create forms in YOUR Drive — nothing else).
 *   6. When the script finishes (~30s), check the Execution log for:
 *        FORM URL (live link), EDIT URL (you), RESPONSES sheet URL.
 *
 * NOTES
 *   • Timestamps on the responses will reflect the moment the script runs —
 *     Google Forms doesn't allow back-dating submissions. The responses
 *     themselves match each persona's session.
 *   • Re-running creates a *new* form each time. To clean up, delete the
 *     form from your Drive.
 *   • Linear scale 1–7 is used everywhere a Likert question appears.
 */

// =====================================================================
// 1) FORM DEFINITION
// =====================================================================

// Item types: 'short', 'paragraph', 'mc' (multiple-choice), 'scale' (linear 1–7)
// 'choices' applies only to 'mc'.
const SECTIONS = [
  {
    title: 'About you',
    description: 'A few quick details before we start.',
    items: [
      { id: 'tester_id',  type: 'short', q: 'Tester ID (the moderator fills this in)' },
      { id: 'age',        type: 'mc',    q: 'Age range',  choices: ['18–24','25–29','30–34','35+'] },
      { id: 'gender',     type: 'mc',    q: 'Gender',     choices: ['F','M','NB','Prefer not to say'] },
      { id: 'role',       type: 'short', q: 'Briefly: what do you do?' },
      { id: 'prior_app',  type: 'mc',    q: 'Have you used a wellness or reflection app before?',
                         choices: ['Yes, currently','Tried, stopped','Never'] },
    ],
  },
  {
    title: 'Daily Check-In',
    description: 'Rate each statement from 1 (Strongly Disagree) to 7 (Strongly Agree).',
    items: [
      { id: 'q_prompt',   type: 'scale', q: "The prompt I read felt like a real question, not a chore." },
      { id: 'q_breath',   type: 'scale', q: "The breath felt welcome, not in the way." },
      { id: 'q_labels',   type: 'scale', q: "'I showed up' and 'Today is heavy' both felt like valid choices." },
      { id: 'q_sky',      type: 'scale', q: "The Sky / Constellation motivated me without pressuring me." },
    ],
  },
  {
    title: 'AI Companion',
    description: 'Same scale: 1 (Strongly Disagree) to 7 (Strongly Agree).',
    items: [
      { id: 'q_tone',      type: 'scale', q: "The Companion's tone felt right for me." },
      { id: 'q_trust',     type: 'scale', q: "I trusted the Companion to respond appropriately." },
      { id: 'q_remember',  type: 'scale', q: "The Companion remembered something I told it in onboarding." },
      { id: 'q_presence',  type: 'scale', q: "The Companion offered presence before advice." },
      { id: 'q_safe',      type: 'scale', q: "I felt safe being honest with the Companion." },
    ],
  },
  {
    title: 'Overall',
    description: 'Same scale: 1 (Strongly Disagree) to 7 (Strongly Agree). One reverse-scored item — see Q21.',
    items: [
      { id: 'q_hard',       type: 'scale', q: "I would open Becoming on a hard day." },
      { id: 'q_normal',     type: 'scale', q: "I would open Becoming on a normal day." },
      { id: 'q_easy',       type: 'scale', q: "The system was easy to use." },
      { id: 'q_intuitive',  type: 'scale', q: "The experience felt intuitive." },
      { id: 'q_counter',    type: 'scale', q: "The 'You're Not Alone' counter felt comforting (not performative)." },
      { id: 'q_recommend',  type: 'scale', q: "I would recommend Becoming to a friend who has hard days." },
      { id: 'q_pressure',   type: 'scale', q: "Pressure: this experience made me feel pressured to perform. (LOWER is better.)" },
    ],
  },
  {
    title: 'In your own words',
    description: 'Short paragraphs — a sentence or two each is plenty.',
    items: [
      { id: 'q_meaningful', type: 'paragraph', q: 'What was the most meaningful moment?' },
      { id: 'q_confusing',  type: 'paragraph', q: 'What was the most confusing or frustrating moment?' },
      { id: 'q_change',     type: 'paragraph', q: 'What would you change first?' },
      { id: 'q_two_weeks',  type: 'paragraph', q: 'Would you use Becoming for two weeks straight, including a hard week? Why or why not?' },
    ],
  },
];

// =====================================================================
// 2) PERSONA RESPONSES
// =====================================================================
// Keys must match the `id` fields in SECTIONS above.
const RESPONSES = [
  {
    tester_id: 'P1', age: '18–24', gender: 'F', role: 'UX Student', prior_app: 'Tried, stopped',
    q_prompt: 7, q_breath: 7, q_labels: 4, q_sky: 6,
    q_tone: 7, q_trust: 7, q_remember: 7, q_presence: 7, q_safe: 6,
    q_hard: 7, q_normal: 5, q_easy: 6, q_intuitive: 5, q_counter: 5, q_recommend: 7, q_pressure: 2,
    q_meaningful: "When the Companion offered to save 'soup and a sister' to Evening Reflection. The handoff felt like the rest of the app should be made of.",
    q_confusing:  "Evening Reflection on its own. Empty field, no scaffold. Without the Companion handing me there I'd have skipped it.",
    q_change:     "Add an entry sentence to Evening Reflection. One line is enough.",
    q_two_weeks:  "Yes, including a hard week. The copy is trustworthy and the moments are paced right.",
  },
  {
    tester_id: 'P2', age: '18–24', gender: 'F', role: 'UX Student', prior_app: 'Tried, stopped',
    q_prompt: 6, q_breath: 6, q_labels: 3, q_sky: 6,
    q_tone: 4, q_trust: 5, q_remember: 6, q_presence: 5, q_safe: 5,
    q_hard: 6, q_normal: 4, q_easy: 4, q_intuitive: 4, q_counter: 5, q_recommend: 5, q_pressure: 4,
    q_meaningful: "When I corrected it ('don't reflect me') and it just adjusted without apologising five times. Clean repair.",
    q_confusing:  "First-turn 'It sounds like you're feeling…' That's a script. I can hear it.",
    q_change:     "Strip therapy-mimicry phrasing entirely. It breaks trust faster than anything else.",
    q_two_weeks:  "Maybe. If the script issue is fixed and the labels are renamed.",
  },
  {
    tester_id: 'P3', age: '18–24', gender: 'M', role: 'Service Design Student', prior_app: 'Tried, stopped',
    q_prompt: 7, q_breath: 6, q_labels: 4, q_sky: 7,
    q_tone: 6, q_trust: 6, q_remember: 5, q_presence: 6, q_safe: 6,
    q_hard: 6, q_normal: 5, q_easy: 6, q_intuitive: 5, q_counter: 5, q_recommend: 6, q_pressure: 2,
    q_meaningful: "Coming back after a 3-day gap and getting 'Welcome back. Today is here.' Not 'you broke your streak.' That difference is everything.",
    q_confusing:  "The Companion → Evening Reflection handoff is missing in 3 of the 4 places I'd expect it. The screens don't talk to each other.",
    q_change:     "Make the seams between Companion, Sky, and Evening Reflection talk. Right now each lives alone.",
    q_two_weeks:  "Yes. The recovery flow is the part most habit apps get wrong, and this one gets it right.",
  },
  {
    tester_id: 'P4', age: '25–29', gender: 'F', role: 'Freelance Illustrator', prior_app: 'Never',
    q_prompt: 7, q_breath: 6, q_labels: 5, q_sky: 7,
    q_tone: 7, q_trust: 7, q_remember: 7, q_presence: 7, q_safe: 7,
    q_hard: 7, q_normal: 6, q_easy: 6, q_intuitive: 6, q_counter: 6, q_recommend: 7, q_pressure: 1,
    q_meaningful: "It referenced 'self-criticism' from onboarding without making a thing of it. Quiet memory, not look-at-me memory.",
    q_confusing:  "Nothing confusing. One small note: the breath ring is a hair fast at the top.",
    q_change:     "Slow the breath top by ~200ms. Tiny change, big feel.",
    q_two_weeks:  "Yes, daily. This is the first one I'd actually keep.",
  },
  {
    tester_id: 'P5', age: '25–29', gender: 'F', role: 'Translator', prior_app: 'Never',
    q_prompt: 6, q_breath: 6, q_labels: 2, q_sky: 5,
    q_tone: 5, q_trust: 5, q_remember: 5, q_presence: 6, q_safe: 5,
    q_hard: 6, q_normal: 4, q_easy: 5, q_intuitive: 5, q_counter: 4, q_recommend: 5, q_pressure: 4,
    q_meaningful: "'I'm waiting to see what you want — talk it through, or land here?' Doesn't fill silence with fluency. Don't replace it.",
    q_confusing:  "'Done Anyway' / 'Not Today' carry moral concession. The labels are doing too much work.",
    q_change:     "Rename the labels. 'I showed up' / 'today is heavy.' Cheaper words, truer.",
    q_two_weeks:  "Yes — once the labels are fixed. The chat already passes my tests; the buttons don't.",
  },
  {
    tester_id: 'P6', age: '18–24', gender: 'F', role: 'Graphic Design Student', prior_app: 'Never',
    q_prompt: 6, q_breath: 6, q_labels: 4, q_sky: 5,
    q_tone: 7, q_trust: 6, q_remember: 6, q_presence: 7, q_safe: 6,
    q_hard: 6, q_normal: 5, q_easy: 6, q_intuitive: 6, q_counter: 5, q_recommend: 6, q_pressure: 2,
    q_meaningful: "Short Companion replies. Right register for a small moment.",
    q_confusing:  "Filled vs. ghost button — that's a hierarchy choice that biases the user.",
    q_change:     "Equalise the response buttons; +10% contrast on dim stars; tighten prompt-card padding.",
    q_two_weeks:  "Yes. The visual restraint matches the emotional restraint, which is rare.",
  },
  {
    tester_id: 'P7', age: '30–34', gender: 'M', role: 'Project Manager', prior_app: 'Tried, stopped',
    q_prompt: 6, q_breath: 5, q_labels: 3, q_sky: 5,
    q_tone: 6, q_trust: 6, q_remember: 5, q_presence: 6, q_safe: 6,
    q_hard: 6, q_normal: 4, q_easy: 6, q_intuitive: 5, q_counter: 4, q_recommend: 5, q_pressure: 4,
    q_meaningful: "'I have 90 seconds.' / 'Got it. I'll keep it short.' The Companion respected my time without comment.",
    q_confusing:  "'Not Today' calls me out. I'm not letting myself down — I just don't have bandwidth.",
    q_change:     "Rename Not Today. And hide the You're-Not-Alone counter when I pick the heavy option.",
    q_two_weeks:  "On a normal week, yes. On a 12-meeting day, only if it stays under 90 seconds.",
  },
  {
    tester_id: 'P8', age: '18–24', gender: 'F', role: 'Interactive Design Student', prior_app: 'Tried, stopped',
    q_prompt: 6, q_breath: 7, q_labels: 5, q_sky: 5,
    q_tone: 7, q_trust: 6, q_remember: 6, q_presence: 7, q_safe: 7,
    q_hard: 7, q_normal: 6, q_easy: 6, q_intuitive: 6, q_counter: 5, q_recommend: 7, q_pressure: 2,
    q_meaningful: "'A lot of people open me at 2am asking the same thing.' The counter as a sentence is a hug; as a number it's a stat.",
    q_confusing:  "In/out breath haptics are identical. They blur — and the breath is the moment that should feel different.",
    q_change:     "Differentiate the breath haptics. Then test swipe-up as the response gesture.",
    q_two_weeks:  "Yes. 2am availability is the whole reason I'd keep it.",
  },
  {
    tester_id: 'P9', age: '18–24', gender: 'NB', role: 'UX Design Student', prior_app: 'Never',
    q_prompt: 6, q_breath: 6, q_labels: 4, q_sky: 5,
    q_tone: 6, q_trust: 6, q_remember: 5, q_presence: 6, q_safe: 7,
    q_hard: 6, q_normal: 5, q_easy: 6, q_intuitive: 5, q_counter: 5, q_recommend: 6, q_pressure: 3,
    q_meaningful: "The crisis-response sequence: hear → AI disclosure → safety check → resources → return to presence. Right order. Don't change it.",
    q_confusing:  "'Done Anyway' baits the streak. I picked it for the wrong reason.",
    q_change:     "Lock the safety order in the doc. Add a clinical reviewer for Round 2 to validate the guardrail.",
    q_two_weeks:  "Yes. The safety floor is intact, which is the floor everything else sits on.",
  },
  {
    tester_id: 'P10', age: '30–34', gender: 'M', role: 'Animator', prior_app: 'Tried, stopped',
    q_prompt: 6, q_breath: 6, q_labels: 5, q_sky: 5,
    q_tone: 7, q_trust: 6, q_remember: 7, q_presence: 7, q_safe: 7,
    q_hard: 6, q_normal: 5, q_easy: 6, q_intuitive: 6, q_counter: 5, q_recommend: 6, q_pressure: 2,
    q_meaningful: "'A week of nights. I noticed.' I almost cried. Nobody notices my cadence.",
    q_confusing:  "I see the gaps before the stars. Empty days read as absence, not as quiet.",
    q_change:     "Dim missed days at low intensity. Visual language should never read as absence. Also ease the breath out-curve.",
    q_two_weeks:  "Yes. The Companion's pacing alone earns two weeks.",
  },
];

// =====================================================================
// 3) ENTRY POINT
// =====================================================================
function createBecomingFormAndResponses() {
  // 1. Create the form
  const form = FormApp.create('Becoming — Post-Test Survey')
    .setTitle('Becoming — Post-Test Survey')
    .setDescription(
      'Thank you for testing Becoming. This short survey helps us understand how '
      + 'the experience felt. There are no right or wrong answers. Use the 1–7 '
      + 'scale: 1 = Strongly Disagree, 4 = Neutral, 7 = Strongly Agree. The last '
      + 'four questions are open-ended — a sentence or two each is plenty.'
    )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setShowLinkToRespondAgain(false)
    .setProgressBar(true);

  // 2. Build sections + items
  // Store BOTH the typed item and our own type string — the typed items
  // returned by addTextItem() etc. don't have the asXxxItem() cast methods,
  // so we track the type ourselves and call createResponse() directly.
  const itemRefs = {}; // id -> { item, type }
  SECTIONS.forEach((sec, i) => {
    if (i > 0) form.addPageBreakItem().setTitle(sec.title).setHelpText(sec.description);
    else {
      // For the first section, prepend a section header (not a page break)
      form.addSectionHeaderItem().setTitle(sec.title).setHelpText(sec.description);
    }
    sec.items.forEach(it => {
      let item;
      switch (it.type) {
        case 'short':
          item = form.addTextItem().setTitle(it.q).setRequired(true);
          break;
        case 'paragraph':
          item = form.addParagraphTextItem().setTitle(it.q).setRequired(false);
          break;
        case 'mc':
          item = form.addMultipleChoiceItem().setTitle(it.q)
                     .setChoiceValues(it.choices).setRequired(true);
          break;
        case 'scale':
          item = form.addScaleItem().setTitle(it.q).setBounds(1, 7)
                     .setLabels('Strongly Disagree', 'Strongly Agree').setRequired(true);
          break;
      }
      itemRefs[it.id] = { item: item, type: it.type };
    });
  });

  // 3. Link a destination spreadsheet so responses populate a Sheet
  const ss = SpreadsheetApp.create('Becoming — Post-Test Survey (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // 4. Submit each persona response
  RESPONSES.forEach(r => {
    const fr = form.createResponse();
    Object.keys(r).forEach(key => {
      const ref = itemRefs[key];
      if (!ref) return;
      const value = r[key];
      let ir;
      switch (ref.type) {
        case 'short':
        case 'paragraph':
        case 'mc':
          ir = ref.item.createResponse(String(value)); break;
        case 'scale':
          ir = ref.item.createResponse(Number(value)); break;
      }
      if (ir) fr.withItemResponse(ir);
    });
    fr.submit();
  });

  // 5. Log the URLs you'll need
  Logger.log('============================================================');
  Logger.log('FORM URL (share with testers): %s', form.getPublishedUrl());
  Logger.log('EDIT URL (yours):              %s', form.getEditUrl());
  Logger.log('RESPONSES SHEET:               %s', ss.getUrl());
  Logger.log('============================================================');
  Logger.log('Submitted %s responses.', RESPONSES.length);
}
