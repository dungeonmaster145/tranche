/**
 * education.js — the learning content, kept as plain data so it can be
 * extended, reviewed, and one day translated without touching UI code.
 *
 * Editorial rule for everything in this file: explain concepts and the
 * user's own situation. Never issue a buy/sell instruction. Education,
 * not advice — that line is what keeps the platform honest and lawful.
 */

export const GLOSSARY = [
  {
    term: "Lump sum",
    short: "A one-time chunk of cash to invest, versus drip-feeding it.",
    long: "Money you invest all at once rather than spreading across regular instalments. Research on long stretches of market history finds investing a lump sum immediately has beaten waiting for a dip about two times out of three — because markets rise more often than they fall. Tranche's job isn't to beat that; it's to make staged deployment disciplined for people who can't stomach all-at-once.",
  },
  {
    term: "Drawdown",
    short: "How far the market has fallen from its most recent peak.",
    long: "If the index hit 7,600 and now sits at 6,840, that's a 10% drawdown. Tranche measures everything in drawdown from the all-time high because it's the honest, emotion-free way to ask 'how cheap is this versus recently?' — without pretending to know the bottom.",
  },
  {
    term: "Dollar/rupee cost averaging (SIP)",
    short: "Investing a fixed amount on a fixed schedule, regardless of price.",
    long: "Your weekly or monthly SIP is this. You buy more units when prices are low and fewer when high, which smooths your average cost and — more importantly — removes the decision (and the emotion) from each purchase. It's the single most reliable habit in retail investing.",
  },
  {
    term: "Diversification",
    short: "Not putting all your money in things that move together.",
    long: "Two funds that hold the same top companies aren't diversification — they're one bet wearing two labels. Real diversification means holding things that zig when others zag: different countries, company sizes, asset types (equity, gold, bonds). It lowers how hard any single bad event can hit you.",
  },
  {
    term: "Emergency fund",
    short: "3–6 months of expenses, kept liquid and never invested.",
    long: "The floor beneath everything. Its job isn't returns — it's so that a job loss or medical bill never forces you to sell investments at a bad moment. In Tranche it's the first gate: money below this line never enters the algorithm, in any market.",
  },
  {
    term: "TCS on foreign remittance (LRS)",
    short: "Indian tax collected upfront when you send large sums abroad.",
    long: "Under India's Liberalised Remittance Scheme, sending above a yearly threshold (₹10 lakh as of recent rules — verify each April, budgets change it) triggers Tax Collected at Source on the excess. You get it back at filing, but it locks up cash meanwhile. Tranche's tracker warns you before a deployment would cross the line.",
  },
  {
    term: "Time backstop",
    short: "A deadline that forces a waiting tranche to deploy anyway.",
    long: "The rule that keeps the system honest. If a tranche is waiting for a 10% drawdown that never comes, its backstop (say, 9 months) deploys it regardless. Without backstops, 'wait for a dip' quietly becomes 'sit in cash for years while the market runs away' — the most common expensive mistake.",
  },
  {
    term: "Expense ratio",
    short: "The annual fee a fund charges, as a % of your money.",
    long: "A 0.05% index fund and a 1.5% active fund sound similar; over 20 years the difference can quietly eat a large slice of your returns. When two funds track the same thing, the cheaper one almost always wins over time. Worth checking before you pick where a tranche lands.",
  },
];

export const CONCEPTS = [
  {
    id: "why-not-time",
    title: "Why you can't time the bottom",
    body: "Nobody — no analyst, fund, or algorithm — reliably calls market bottoms. The data is blunt: miss just a handful of the market's best days (which cluster right after the scary drops) and your long-run return collapses. That's why Tranche deploys a large slice immediately and only stages the rest. Waiting for certainty is itself the gamble.",
  },
  {
    id: "what-drawdowns-mean",
    title: "What a 10% drop actually means",
    body: "Market falls of 5–10% happen most years — they're normal weather, not emergencies. Falls of 20%+ (a 'bear market') are rarer and have always, so far, eventually recovered, though recovery has sometimes taken years. Knowing this is what lets you treat a red day as a scheduled trigger rather than a reason to panic-sell.",
  },
  {
    id: "savings-rate",
    title: "Your savings rate beats your stock picks",
    body: "For most people building wealth, how much you invest each month matters far more than which fund or when. Doubling your monthly contribution does more over 20 years than perfectly timing a lump sum ever could. The boring lever is the powerful one. Tranche handles the lump-sum question precisely so you stop overweighting it.",
  },
  {
    id: "concentration",
    title: "The hidden risk of owning 'two' funds",
    body: "Many people hold an S&P 500 fund and a Nasdaq fund and feel diversified. But the biggest companies dominate both, so you've really doubled down on mega-cap tech. Check what your funds actually hold at the top — if the names repeat, you own one bet, not two. Diversification is about what moves differently, not how many tickers you have.",
  },
];

export const DISCLAIMER =
  "Tranche is educational software that executes rules you set. It is not financial, investment, tax, or legal advice, and its makers are not your advisers. Every investment decision is yours alone. Markets can behave worse than any historical pattern suggests. Tax rules change — verify current thresholds before acting.";
