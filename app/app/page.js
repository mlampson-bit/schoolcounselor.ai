"use client";

const requirementsByProgram = {
  cs: [
    {
      id: "math",
      name: "Mathematics",
      creditsNeeded: 8,
      acceptedTags: ["math"],
      description: "Calculus and discrete math.",
    },
    {
      id: "science",
      name: "Science",
      creditsNeeded: 8,
      acceptedTags: ["science"],
      description: "Physics, chemistry, or biology.",
    },
    {
      id: "writing",
      name: "Writing",
      creditsNeeded: 6,
      acceptedTags: ["writing"],
      description: "English and communication.",
    },
    {
      id: "core",
      name: "CS Core",
      creditsNeeded: 12,
      acceptedTags: ["cs"],
      description: "Core CS classes.",
    },
  ],
};

const courses = [
  { code: "MATH 151", credits: 4, tags: ["math"] },
  { code: "MATH 220", credits: 4, tags: ["math"] },
  { code: "PHYS 121", credits: 4, tags: ["science"] },
  { code: "ENGL 101", credits: 3, tags: ["writing"] },
  { code: "COMM 210", credits: 3, tags: ["writing"] },
  { code: "CS 101", credits: 3, tags: ["cs"] },
  { code: "CS 201", credits: 4, tags: ["cs"] },
  { code: "CS 301", credits: 4, tags: ["cs"] },
];

function matchCourses(input) {
  return courses.filter((c) =>
    input.toLowerCase().includes(c.code.toLowerCase())
  );
}

function allocate(reqs, selected) {
  const result = reqs.map((r) => ({
    ...r,
    remaining: r.creditsNeeded,
    courses: [],
  }));

  selected.forEach((course) => {
    const match = result.find(
      (r) =>
        course.tags.some((t) => r.acceptedTags.includes(t)) &&
        r.remaining > 0
    );

    if (match) {
      match.courses.push(course);
      match.remaining -= course.credits;
    }
  });

  return result;
}

export default function Page() {
  const input = "MATH 151, ENGL 101, CS 201, PHYS 121";
  const selected = matchCourses(input);
  const reqs = requirementsByProgram.cs;
  const results = allocate(reqs, selected);

  const total = reqs.reduce((s, r) => s + r.creditsNeeded, 0);
  const done = results.reduce(
    (s, r) => s + (r.creditsNeeded - r.remaining),
    0
  );
  const percent = Math.round((done / total) * 100);

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>SchoolCounselor.ai</h1>
      <p>AI-powered class credit checker</p>

      <h2>Progress: {percent}%</h2>

      <h3>Detected Courses</h3>
      <ul>
        {selected.map((c) => (
          <li key={c.code}>
            {c.code} ({c.credits} credits)
          </li>
        ))}
      </ul>

      <h3>Requirements</h3>
      {results.map((r) => (
        <div key={r.id} style={{ marginBottom: 20 }}>
          <strong>{r.name}</strong>
          <div>
            {r.remaining <= 0
              ? "✅ Completed"
              : `${r.remaining} credits remaining`}
          </div>

          <ul>
            {r.courses.map((c) => (
              <li key={c.code}>{c.code}</li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
