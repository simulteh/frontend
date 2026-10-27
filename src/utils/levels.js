// Обучение + 10 уровней игры
export const LEVELS = ['Обучение', ...Array.from({ length: 10 }, (_, i) => `${i + 1} уровень`)];

// Максимальный балл за уровень
export const MAX_SCORE = 10;

// scores — массив [обучение, ур.1, ..., ур.10] либо объект { tutorial, 1: ..., 10: ... }
export const scoreAt = (scores, index) => {
  if (!scores) return null;
  const value = Array.isArray(scores) ? scores[index] : scores[index === 0 ? 'tutorial' : index];
  return value ?? null;
};

const numericScores = (scores) =>
  LEVELS.map((_, i) => scoreAt(scores, i))
    .filter((v) => v !== null && !Number.isNaN(Number(v)))
    .map(Number);

export const passedCount = (scores) => numericScores(scores).length;

// Средний балл по пройденным уровням
export const averageScore = (scores) => {
  const values = numericScores(scores);
  if (values.length === 0) return null;
  return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(1);
};
