export const generateTags = async (text) => {
  // Simulates AI by picking the longest words as tags
  const words = text.split(/\W+/).filter(w => w.length > 3);
  const tags = [...new Set(words)].slice(0, 3).join(", ");
  return tags || "general, post, doubt";
};

export const generateHint = async (question) => {
  // Returns a helpful generic message based on the question
  return `💡 Focus on the core logic: "${question}". Try breaking it into smaller steps!`;
};

export const generateQuiz = async (topic) => {
  // Returns a structural template for a quiz
  return JSON.stringify([
    {
      q: `What is a core concept of ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      a: "Option A"
    },
    {
      q: `True or False: ${topic} is widely used in tech?`,
      options: ["True", "False"],
      a: "True"
    }
  ]);
};
