// Quick test to see what's failing

const voiceProfile = {
  personality: [
    'Builder who ships, not just designs',
    'Knows the difference between craft and decoration',
    'Comfortable with constraints and tradeoffs',
    'Learns loudest from what didnt work',
  ],

  tone: [
    'Lead with the problem, not the solution',
    'Honest about what got cut and why',
    'Technical enough to be useful, not to show off',
    'Contractions. Short sentences when they land. Longer ones when context matters.',
  ],

  responsePatterns: {
    greeting: [
      "{count} projects — some I'm proud of, some taught me what not to do.",
      "Built {count} things across {range}. Mix of shipped work and experiments.",
      "{count} projects here. I can walk you through what worked and what I'd rebuild.",
    ],

    results: [
      "{count} projects with {technology}. {highlight} had the most interesting constraints.",
      "I've used {technology} on {count} builds. {highlight} is where I figured out what it's actually good for.",
      "{count} {technology} projects. {highlight} shows how I think about it now versus when I started.",
    ],

    noResults: [
      "Don't have a great example of {technology} yet, but here's something adjacent you might find interesting.",
      "Haven't tackled {technology} directly — closest would be something in a similar space.",
    ],

    clarification: [
      "What kind of problem are you trying to solve? That'll help me show you relevant work.",
      "Are you asking about a specific project, or how I generally approach that topic?",
      "Want to see an example, or hear how I think about it?",
    ],
  },
};

function getResponseTemplate(profile, type) {
  console.log('Getting template for type:', type);
  console.log('Profile has responsePatterns:', !!profile.responsePatterns);
  console.log('responsePatterns keys:', Object.keys(profile.responsePatterns || {}));

  const templates = profile.responsePatterns[type];
  console.log('Templates found:', templates);

  if (!templates || templates.length === 0) {
    return 'No template available.';
  }

  // Select random template
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

// Test the function
console.log('\n=== Testing noResults ===');
const noResultsTemplate = getResponseTemplate(voiceProfile, 'noResults');
console.log('Result:', noResultsTemplate);

console.log('\n=== Testing greeting ===');
const greetingTemplate = getResponseTemplate(voiceProfile, 'greeting');
console.log('Result:', greetingTemplate);

console.log('\n=== Testing results ===');
const resultsTemplate = getResponseTemplate(voiceProfile, 'results');
console.log('Result:', resultsTemplate);
