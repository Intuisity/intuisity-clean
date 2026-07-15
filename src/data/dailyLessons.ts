type PositivityTarget = {
  label: string;
  reflectionAngle: string;
};

type PositivityAction = {
  title: string;
  action: (target: string) => string;
  reflection: (target: PositivityTarget) => string;
};

const targets: PositivityTarget[] = [
  { label: "a friend you have spoken to lately", reflectionAngle: "current friendship" },
  { label: "a friend you have not seen in a while", reflectionAngle: "reconnection" },
  { label: "a loved one", reflectionAngle: "love and appreciation" },
  { label: "someone in your family", reflectionAngle: "family connection" },
  { label: "someone you have not talked with in the past year", reflectionAngle: "old connection" },
  { label: "someone who helped you before", reflectionAngle: "gratitude" },
  { label: "someone who may be feeling overlooked", reflectionAngle: "kindness" },
  { label: "a neighbor, coworker, or community member", reflectionAngle: "everyday connection" },
  { label: "someone who usually supports everyone else", reflectionAngle: "support" },
  { label: "someone your intuition brings to mind", reflectionAngle: "inner knowing" }
];

const actions: PositivityAction[] = [
  {
    title: "Coffee Invitation",
    action: (target) => `Invite ${target} to coffee, tea, lunch, or a short walk.`,
    reflection: (target) => `What did this ${target.reflectionAngle} invitation open up?`
  },
  {
    title: "Unexpected Note",
    action: (target) => `Write a short note to ${target} and put it somewhere they will not expect, or send it as a message.`,
    reflection: (target) => `How did it feel to offer ${target.reflectionAngle} in a surprising way?`
  },
  {
    title: "Catch-Up Call",
    action: (target) => `Call ${target} and ask what has been happening in their life lately.`,
    reflection: (target) => `What did you learn by making room for ${target.reflectionAngle}?`
  },
  {
    title: "Voice Message",
    action: (target) => `Send ${target} a warm voice message instead of a plain text.`,
    reflection: (target) => `Did using your voice make the ${target.reflectionAngle} feel more personal?`
  },
  {
    title: "Photo Memory",
    action: (target) => `Send ${target} a photo or memory that reminds you of a good moment together.`,
    reflection: (target) => `What feeling returned when you revisited that ${target.reflectionAngle} memory?`
  },
  {
    title: "Specific Compliment",
    action: (target) => `Give ${target} one specific compliment about their character, effort, or kindness.`,
    reflection: (target) => `What changed when you named something real in this ${target.reflectionAngle}?`
  },
  {
    title: "Small Help",
    action: (target) => `Offer ${target} one practical bit of help, even if it is small.`,
    reflection: (target) => `How did action change the feeling of ${target.reflectionAngle}?`
  },
  {
    title: "Ask One Better Question",
    action: (target) => `Ask ${target} one thoughtful question and really listen to the answer.`,
    reflection: (target) => `What did deeper listening reveal about this ${target.reflectionAngle}?`
  },
  {
    title: "Thank-You Message",
    action: (target) => `Send ${target} a thank-you message for something specific they did or once gave you.`,
    reflection: (target) => `What did gratitude bring back into this ${target.reflectionAngle}?`
  },
  {
    title: "Encouragement Text",
    action: (target) => `Send ${target} one sentence of encouragement for something they are facing or building.`,
    reflection: (target) => `How did encouragement affect your sense of ${target.reflectionAngle}?`
  },
  {
    title: "Shared Plan",
    action: (target) => `Suggest one simple plan with ${target}, such as a walk, meal, errand, or phone date.`,
    reflection: (target) => `What did making a plan do for this ${target.reflectionAngle}?`
  },
  {
    title: "Remember Their Win",
    action: (target) => `Remind ${target} of a strength, success, or hard season they made it through.`,
    reflection: (target) => `How did honoring their strength deepen this ${target.reflectionAngle}?`
  },
  {
    title: "Tiny Gift",
    action: (target) => `Give or send ${target} a tiny thoughtful gift, link, recipe, flower, song, or quote.`,
    reflection: (target) => `What did thoughtfulness add to this ${target.reflectionAngle}?`
  },
  {
    title: "Repair Step",
    action: (target) => `If it feels right, take one gentle repair step with ${target}, such as apologizing or clearing up a misunderstanding.`,
    reflection: (target) => `What did courage teach you about this ${target.reflectionAngle}?`
  },
  {
    title: "Celebrate Them",
    action: (target) => `Tell ${target} one thing about them that deserves to be celebrated.`,
    reflection: (target) => `What did celebration bring into this ${target.reflectionAngle}?`
  },
  {
    title: "Check-In Reminder",
    action: (target) => `Set a reminder to check in with ${target} again next week.`,
    reflection: (target) => `What does consistency mean for this ${target.reflectionAngle}?`
  },
  {
    title: "Share a Laugh",
    action: (target) => `Send ${target} something light, funny, or sweet that could make them smile.`,
    reflection: (target) => `How did playfulness affect this ${target.reflectionAngle}?`
  },
  {
    title: "Invite Support",
    action: (target) => `Let ${target} know one honest thing you are working through and invite a real conversation.`,
    reflection: (target) => `How did honesty shift this ${target.reflectionAngle}?`
  },
  {
    title: "Offer Recognition",
    action: (target) => `Recognize ${target} for something they do that others may not notice.`,
    reflection: (target) => `What did noticing the unseen reveal about this ${target.reflectionAngle}?`
  },
  {
    title: "Kind Errand",
    action: (target) => `Do or offer one small errand for ${target}, such as picking something up, returning a call, or sharing a resource.`,
    reflection: (target) => `How did useful kindness feel in this ${target.reflectionAngle}?`
  },
  {
    title: "Memory Question",
    action: (target) => `Ask ${target} about a favorite memory, story, meal, trip, or season of life.`,
    reflection: (target) => `What did curiosity bring to this ${target.reflectionAngle}?`
  },
  {
    title: "Forgiveness Breath",
    action: (target) => `Think of ${target}, take three slow breaths, and release one small resentment if you are ready.`,
    reflection: (target) => `What softened when you gave this ${target.reflectionAngle} more space?`
  },
  {
    title: "Invitation to Rest",
    action: (target) => `Tell ${target} they do not have to earn rest, and encourage them to take one peaceful pause today.`,
    reflection: (target) => `How did offering rest affect this ${target.reflectionAngle}?`
  },
  {
    title: "Old Thread",
    action: (target) => `Look back at an old message thread with ${target} and send a kind follow-up from the heart.`,
    reflection: (target) => `What did returning to that thread reveal about this ${target.reflectionAngle}?`
  },
  {
    title: "Gratitude List",
    action: (target) => `Write three things you appreciate about ${target}, then share one of them.`,
    reflection: (target) => `Which appreciation felt strongest in this ${target.reflectionAngle}?`
  },
  {
    title: "Open Door",
    action: (target) => `Let ${target} know your door is open if they ever need to talk.`,
    reflection: (target) => `How did making yourself available affect this ${target.reflectionAngle}?`
  },
  {
    title: "Shared Song",
    action: (target) => `Send ${target} a song that carries a good memory, peaceful feeling, or hopeful message.`,
    reflection: (target) => `What emotion did music bring into this ${target.reflectionAngle}?`
  },
  {
    title: "Blessing Message",
    action: (target) => `Send ${target} a simple blessing or wish for their day.`,
    reflection: (target) => `How did wishing someone well shape this ${target.reflectionAngle}?`
  },
  {
    title: "Ask What They Need",
    action: (target) => `Ask ${target}, "What would feel supportive to you this week?"`,
    reflection: (target) => `What did their answer teach you about this ${target.reflectionAngle}?`
  },
  {
    title: "Brave Reach-Out",
    action: (target) => `Reach out to ${target} even if it feels a little awkward, as long as it feels safe and kind.`,
    reflection: (target) => `What did bravery add to this ${target.reflectionAngle}?`
  }
];

export const dailyIntuitionLessons = targets.flatMap((target) =>
  actions.map((item, index) => ({
    title: `${item.title}: ${target.label}`,
    points: [
      "Try one positive action in real life today.",
      "Let awareness, kindness, and inner wisdom guide who you choose.",
      "Small actions can create meaningful synchronicity, connection, and personal growth."
    ],
    practice: `Today's task: ${item.action(target.label)}`,
    reflection: `Afterward, ask yourself: ${item.reflection(target)}`
  }))
);
