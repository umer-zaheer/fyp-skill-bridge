/**
 * Quiz-from-PDF generation service.
 * Frontend-only mock today — swap `generateQuizFromPdf` body with a real API call later.
 *
 * Expected backend contract (when ready):
 *   POST /api/instructor/quizzes/generate
 *   Content-Type: multipart/form-data
 *   fields: file (PDF), title, courseId, questionCount, difficulty, types[]
 *   response: { quizId, questions: GeneratedQuestion[] }
 */

export type Difficulty = "easy" | "medium" | "hard" | "mixed";
export type QuestionType = "mcq" | "true_false" | "short";

export type GeneratedQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type GenerateQuizInput = {
  file: File;
  title: string;
  course: string;
  questionCount: number;
  difficulty: Difficulty;
  types: QuestionType[];
};

export type GenerateQuizResult = {
  quizId: string;
  sourceFile: string;
  questions: GeneratedQuestion[];
};

const MOCK_BANK: Omit<GeneratedQuestion, "id">[] = [
  {
    type: "mcq",
    prompt: "What is the primary purpose of TypeScript's `infer` keyword?",
    options: [
      "Declare runtime variables",
      "Capture a type from within a conditional pattern",
      "Force strict null checks",
      "Compile JSX faster",
    ],
    answerIndex: 1,
    explanation: "`infer` introduces a type variable inside a conditional type pattern.",
  },
  {
    type: "mcq",
    prompt: "Which utility type makes all properties of T optional?",
    options: ["Required<T>", "Readonly<T>", "Partial<T>", "Record<K, T>"],
    answerIndex: 2,
    explanation: "`Partial<T>` maps every property to optional.",
  },
  {
    type: "true_false",
    prompt: "Distributive conditional types distribute over naked type-parameter unions.",
    options: ["True", "False"],
    answerIndex: 0,
    explanation: "Yes — naked `T extends U ? X : Y` distributes when T is a union.",
  },
  {
    type: "mcq",
    prompt: "What does `satisfies` do in TypeScript?",
    options: [
      "Casts a value without checking",
      "Validates a value against a type while keeping its narrower inferred type",
      "Removes unused imports",
      "Enables decorators",
    ],
    answerIndex: 1,
    explanation: "`satisfies` checks assignability but preserves the original inferred type.",
  },
  {
    type: "mcq",
    prompt: "Which statement about `unknown` is correct?",
    options: [
      "It is assignable to any other type freely",
      "You must narrow it before use",
      "It is the same as `any`",
      "It only works with classes",
    ],
    answerIndex: 1,
    explanation: "`unknown` is the type-safe counterpart of `any` — narrowing is required.",
  },
  {
    type: "true_false",
    prompt: "`ReadonlyArray<T>` allows `.push()` at compile time.",
    options: ["True", "False"],
    answerIndex: 1,
    explanation: "Readonly arrays forbid mutating methods like push/pop/splice.",
  },
  {
    type: "mcq",
    prompt: "What is a mapped type used for?",
    options: [
      "Runtime object cloning only",
      "Transforming property types of an existing type",
      "Defining CSS modules",
      "Bundling assets",
    ],
    answerIndex: 1,
    explanation: "Mapped types iterate keys and transform property types.",
  },
  {
    type: "mcq",
    prompt: "Which of these is a valid branded/opaque type pattern?",
    options: [
      "type UserId = string & { readonly __brand: 'UserId' }",
      "type UserId = any",
      "type UserId = never",
      "type UserId = unknown[]",
    ],
    answerIndex: 0,
    explanation: "Intersection with a unique brand prevents accidental string mixing.",
  },
  {
    type: "short",
    prompt: "Name the utility that constructs a type with a subset of keys from T.",
    options: ["Pick<T, K>", "Omit<T, K>", "Exclude<T, U>", "Extract<T, U>"],
    answerIndex: 0,
    explanation: "`Pick<T, K>` selects a subset of properties.",
  },
  {
    type: "mcq",
    prompt: "When does `as const` help most?",
    options: [
      "Widening literals to string/number",
      "Narrowing literals and making structures deeply readonly",
      "Disabling type checking",
      "Enabling experimental decorators",
    ],
    answerIndex: 1,
    explanation: "`as const` freezes literals and deep-readonly inference.",
  },
  {
    type: "true_false",
    prompt: "Interfaces can extend other interfaces; type aliases cannot use intersections.",
    options: ["True", "False"],
    answerIndex: 1,
    explanation: "Type aliases can combine types with intersections (`&`).",
  },
  {
    type: "mcq",
    prompt: "What does `keyof typeof obj` produce?",
    options: [
      "Runtime keys as an array",
      "A union of the object's property names",
      "The object's prototype",
      "A Promise of keys",
    ],
    answerIndex: 1,
    explanation: "`keyof` on a typeof object yields a string/number literal union of keys.",
  },
  {
    type: "mcq",
    prompt: "Which pattern avoids excess property checks on object literals?",
    options: [
      "Assign through a variable first",
      "Always use `any`",
      "Disable strict mode",
      "Use `eval`",
    ],
    answerIndex: 0,
    explanation: "Freshness checks apply to object literals; variables skip excess checks.",
  },
  {
    type: "mcq",
    prompt: "What is the return type of `Array.prototype.map` when typed?",
    options: ["any[]", "unknown[]", "U[] based on the callback return", "never[]"],
    answerIndex: 2,
    explanation: "Generics flow the callback's return type into the resulting array.",
  },
  {
    type: "true_false",
    prompt: "`strictNullChecks` treats `null` and `undefined` as assignable to every type.",
    options: ["True", "False"],
    answerIndex: 1,
    explanation: "With strictNullChecks, null/undefined must be explicitly allowed.",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulated upload + AI generation. Replace with fetch/FormData when backend is ready. */
export async function generateQuizFromPdf(
  input: GenerateQuizInput,
  onProgress?: (pct: number, label: string) => void,
): Promise<GenerateQuizResult> {
  const steps: { pct: number; label: string; wait: number }[] = [
    { pct: 8, label: "Uploading PDF…", wait: 450 },
    { pct: 22, label: "Extracting text from document…", wait: 700 },
    { pct: 40, label: "Chunking content for analysis…", wait: 550 },
    { pct: 58, label: "Generating questions with AI…", wait: 900 },
    { pct: 78, label: "Scoring difficulty & diversity…", wait: 600 },
    { pct: 92, label: "Validating answers…", wait: 450 },
    { pct: 100, label: "Done", wait: 250 },
  ];

  for (const step of steps) {
    onProgress?.(step.pct, step.label);
    await delay(step.wait);
  }

  const allowed = new Set(input.types);
  const pool = MOCK_BANK.filter((q) => allowed.has(q.type));
  const source = pool.length ? pool : MOCK_BANK;
  const count = Math.min(Math.max(input.questionCount, 3), source.length);

  // Deterministic-ish shuffle from file size + name
  const seed = input.file.size + input.file.name.length;
  const shuffled = [...source].sort((a, b) => {
    const ha = (a.prompt.length * 31 + seed) % 97;
    const hb = (b.prompt.length * 17 + seed) % 97;
    return ha - hb;
  });

  const questions: GeneratedQuestion[] = shuffled.slice(0, count).map((q, i) => ({
    ...q,
    id: `gq-${Date.now()}-${i}`,
  }));

  return {
    quizId: `draft-${Date.now()}`,
    sourceFile: input.file.name,
    questions,
  };
}

export const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB

export function validatePdfFile(file: File): string | null {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Only PDF files are supported.";
  if (file.size <= 0) return "File appears empty.";
  if (file.size > MAX_PDF_BYTES) return "PDF must be 15 MB or smaller.";
  return null;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
