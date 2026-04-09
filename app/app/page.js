const requirementsByProgram = {
  cs: [
    {
      id: "math",
      name: "Mathematics",
      creditsNeeded: 8,
      acceptedTags: ["math"],
      description: "Calculus, discrete math, and other math-designated coursework.",
    },
    {
      id: "science",
      name: "Natural Science",
      creditsNeeded: 8,
      acceptedTags: ["science", "lab"],
      description: "Biology, chemistry, physics, or approved lab sciences.",
    },
    {
      id: "writing",
      name: "Writing",
      creditsNeeded: 6,
      acceptedTags: ["writing", "humanities"],
      description: "Composition, advanced writing, or approved communication-intensive courses.",
    },
    {
      id: "ethics",
      name: "Ethics & Society",
      creditsNeeded: 3,
      acceptedTags: ["ethics", "humanities", "social-science"],
      description: "Ethics, policy, or society-focused coursework.",
    },
    {
      id: "major-core",
      name: "Major Core",
      creditsNeeded: 15,
      acceptedTags: ["cs-core"],
      description: "Core computer science courses required for the major.",
    },
  ],
   business: [
    {
      id: "quant",
      name: "Quantitative Skills",
      creditsNeeded: 6,
      acceptedTags: ["math", "analytics"],
      description: "Statistics, business calculus, or analytics coursework.",
    },
    {
      id: "economics",
      name: "Economics",
      creditsNeeded: 6,
      acceptedTags: ["economics"],
      description: "Microeconomics, macroeconomics, or approved substitutes.",
    },
    {
      id: "communication",
      name: "Communication",
      creditsNeeded: 6,
      acceptedTags: ["writing", "communication"],
      description: "Business writing, speaking, or communication-intensive courses.",
    },
    {
      id: "major-core",
      name: "Business Core",
      creditsNeeded: 15,
      acceptedTags: ["business-core"],
      description: "Accounting, finance, marketing, and other required business courses.",
    },
  ],
};

const sampleCourses = [
  { code: "MATH 151", title: "Calculus I", credits: 4, tags: ["math"] },
  { code: "MATH 220", title: "Discrete Mathematics", credits: 4, tags: ["math"] },
  { code: "PHYS 121", title: "General Physics I", credits: 4, tags: ["science", "lab"] },
  { code: "CHEM 101", title: "Introductory Chemistry", credits: 4, tags: ["science", "lab"] },
  { code: "ENGL 101", title: "College Writing", credits: 3, tags: ["writing", "humanities"] },
  { code: "COMM 210", title: "Public Speaking", credits: 3, tags: ["communication", "writing"] },
  { code: "PHIL 240", title: "Ethics in Technology", credits: 3, tags: ["ethics", "humanities"] },
  { code: "SOC 110", title: "Introduction to Society", credits: 3, tags: ["social-science"] },
  { code: "CS 101", title: "Intro to Programming", credits: 3, tags: ["cs-core"] },
  { code: "CS 201", title: "Data Structures", credits: 4, tags: ["cs-core"] },
  { code: "CS 301", title: "Algorithms", credits: 4, tags: ["cs-core"] },
  { code: "CS 315", title: "Computer Systems", credits: 4, tags: ["cs-core"] },
  { code: "ECON 101", title: "Microeconomics", credits: 3, tags: ["economics"] },
  { code: "ECON 102", title: "Macroeconomics", credits: 3, tags: ["economics"] },
  { code: "STAT 201", title: "Business Statistics", credits: 3, tags: ["analytics", "math"] },
  { code: "ACCT 201", title: "Financial Accounting", credits: 3, tags: ["business-core"] },
  { code: "FIN 301", title: "Corporate Finance", credits: 3, tags: ["business-core"] },
  { code: "MKTG 210", title: "Principles of Marketing", credits: 3, tags: ["business-core"] },
];

function normalize(text) {
  return text.toLowerCase().trim();
}

function findCoursesFromText(text) {
  const q = normalize(text);
  if (!q) return [];

  const exactCodes = sampleCourses.filter((course) => q.includes(course.code.toLowerCase()));
  if (exactCodes.length) return exactCodes;

  return sampleCourses.filter((course) => {
    const haystack = `${course.code} ${course.title} ${course.tags.join(" ")}`.toLowerCase();
    return q.split(/[\n,]+/).some((part) => haystack.includes(part.trim()));
  });
}

function allocateCourses(requirements, selectedCourses) {
  const remaining = requirements.map((req) => ({ ...req, remaining: req.creditsNeeded, courses: [] }));
  const unassigned = [];

  for (const course of selectedCourses) {
    const match = remaining
      .filter((req) => course.tags.some((tag) => req.acceptedTags.includes(tag)) && req.remaining > 0)
      .sort((a, b) => b.remaining - a.remaining)[0];

    if (match) {
      match.courses.push(course);
      match.remaining = Math.max(0, match.remaining - course.credits);
    } else {
      unassigned.push(course);
    }
  }

  return { remaining, unassigned };
}

function suggestCourses(requirements, allocation, selectedCourses) {
  const selectedCodes = new Set(selectedCourses.map((c) => c.code));
  const suggestions = [];

  allocation.remaining.forEach((req) => {
    if (req.remaining <= 0) return;

    const matches = sampleCourses
      .filter(
        (course) =>
          !selectedCodes.has(course.code) &&
          course.tags.some((tag) => req.acceptedTags.includes(tag))
      )
      .slice(0, 3);

    suggestions.push({ requirement: req.name, remaining: req.remaining, matches });
  });

  return suggestions;
}

function buildAiSummary(program, allocation, suggestions) {
  const unmet = allocation.remaining.filter((r) => r.remaining > 0);
  const satisfied = allocation.remaining.filter((r) => r.remaining <= 0);

  if (!unmet.length) {
    return `Your selected courses appear to satisfy all tracked ${program === "cs" ? "Computer Science" : "Business"} credit areas in this demo. You should still verify catalog-year policies and advisor approval.`;
  }

  const topGap = unmet[0];
  const leadSuggestion = suggestions[0]?.matches?.[0];

  return `The biggest remaining gap is ${topGap.name} with ${topGap.remaining} credits left. ${satisfied.length ? `${satisfied.length} requirement area${satisfied.length > 1 ? "s are" : " is"} already covered.` : "No requirement areas are fully covered yet."} ${leadSuggestion ? `A strong next course to consider is ${leadSuggestion.code} ${leadSuggestion.title}.` : "Add more courses or course rules to improve recommendations."}`;
}

export default function Home() {
  const program = "cs";
  const query = "MATH 151, ENGL 101, CS 201, PHYS 121, PHIL 240";
  const selectedCourses = findCoursesFromText(query);
  const requirements = requirementsByProgram[program];
  const allocation = allocateCourses(requirements, selectedCourses);
  const suggestions = suggestCourses(requirements, allocation, selectedCourses);
  const aiSummary = buildAiSummary(program, allocation, suggestions);
  const total = requirements.reduce((sum, req) => sum + req.creditsNeeded, 0);
  const completed = allocation.remaining.reduce((sum, req) => sum + (req.creditsNeeded - req.remaining), 0);
  const percentComplete = Math.round((completed / total) * 100);

  return (
    <main className="page">
      <section className="hero card">
        <div className="pill">AI-assisted degree audit</div>
        <h1>SchoolCounselor.ai</h1>
        <p>
          Check what classes fulfill degree credits, spot gaps, and get AI-style guidance on
          what to take next.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span>Program</span>
            <strong>Computer Science</strong>
          </div>
          <div className="stat">
            <span>Progress</span>
            <strong>{percentComplete}%</strong>
          </div>
          <div className="stat">
            <span>Matched Courses</span>
            <strong>{selectedCourses.length}</strong>
          </div>
        </div>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>Detected Courses</h2>
          <div className="badge-row">
            {selectedCourses.map((course) => (
              <span className="badge" key={course.code}>
                {course.code} · {course.credits} cr
              </span>
            ))}
          </div>
        </div>

        <div className="card accent">
          <h2>AI Recommendation</h2>
          <p>{aiSummary}</p>
        </div>
      </section>

      <section className="card">
        <h2>Requirement Coverage</h2>
        <div className="requirement-list">
          {allocation.remaining.map((req) => {
            const completion = Math.min(
              100,
              Math.round(((req.creditsNeeded - req.remaining) / req.creditsNeeded) * 100)
            );

            return (
              <div className="requirement" key={req.id}>
                <div className="requirement-top">
                  <div>
                    <h3>{req.name}</h3>
                    <p>{req.description}</p>
                  </div>
                  <span className="status">
                    {req.remaining <= 0 ? "Satisfied" : `${req.remaining} credits left`}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${completion}%` }} />
                </div>
                <div className="badge-row">
                  {req.courses.length ? (
                    req.courses.map((course) => (
                      <span className="badge" key={course.code}>
                        {course.code}
                      </span>
                    ))
                  ) : (
                    <span className="muted">No classes assigned yet</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid two-col">
        <div className="card">
          <h2>Suggested Next Classes</h2>
          <div className="stack">
            {suggestions.map((group) => (
              <div className="suggestion" key={group.requirement}>
                <div className="suggestion-top">
                  <strong>{group.requirement}</strong>
                  <span>{group.remaining} credits needed</span>
                </div>
                <div className="stack small-gap">
                  {group.matches.map((course) => (
                    <div className="mini-card" key={course.code}>
                      <strong>{course.code}</strong>
                      <span>{course.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>How to make it real</h2>
          <ul>
            <li>Store official degree requirements in a database.</li>
            <li>Add transcript upload and transfer equivalency logic.</li>
            <li>Connect an AI API for rule extraction and explanations.</li>
            <li>Mark all AI results as advisory until verified.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
