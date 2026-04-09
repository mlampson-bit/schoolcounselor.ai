import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Search, CheckCircle2, AlertTriangle, BookOpen, Wand2, GraduationCap, Filter, ArrowRight } from "lucide-react";

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

  const exactCodes = sampleCourses.filter((course) =>
    q.includes(course.code.toLowerCase())
  );

  if (exactCodes.length) return exactCodes;

  return sampleCourses.filter((course) => {
    const haystack = `${course.code} ${course.title} ${course.tags.join(" ")}`.toLowerCase();
    return q.split(/[,\n]+/).some((part) => haystack.includes(part.trim()));
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
    return `Your selected courses appear to satisfy all tracked ${program === "cs" ? "Computer Science" : "Business"} credit areas in this demo. You should still verify residency rules, minimum grades, and catalog-year policies with an official degree audit.`;
  }

  const topGap = unmet[0];
  const leadSuggestion = suggestions[0]?.matches?.[0];

  return `The biggest remaining gap is ${topGap.name} with ${topGap.remaining} credits left. ${satisfied.length ? `${satisfied.length} requirement area${satisfied.length > 1 ? "s are" : " is"} already covered.` : "No requirement areas are fully covered yet."} ${leadSuggestion ? `A strong next course to consider is ${leadSuggestion.code} ${leadSuggestion.title}.` : "Add more courses or course rules to improve recommendations."}`;
}

export default function ClassCreditCheckerWebsite() {
  const [program, setProgram] = useState("cs");
  const [query, setQuery] = useState("MATH 151, ENGL 101, CS 201, PHYS 121, PHIL 240");
  const [catalogText, setCatalogText] = useState("Paste degree rules, transfer guides, or course catalog notes here. Example: 'Students may use PHIL 240 to satisfy Ethics & Society. COMM 210 can count toward Communication or Writing.'");
  const [tagFilter, setTagFilter] = useState("all");

  const requirements = requirementsByProgram[program];

  const selectedCourses = useMemo(() => findCoursesFromText(query), [query]);
  const allocation = useMemo(() => allocateCourses(requirements, selectedCourses), [requirements, selectedCourses]);
  const suggestions = useMemo(() => suggestCourses(requirements, allocation, selectedCourses), [requirements, allocation, selectedCourses]);

  const percentComplete = useMemo(() => {
    const total = requirements.reduce((sum, req) => sum + req.creditsNeeded, 0);
    const completed = allocation.remaining.reduce((sum, req) => sum + (req.creditsNeeded - req.remaining), 0);
    return Math.round((completed / total) * 100);
  }, [requirements, allocation]);

  const filteredCatalogCourses = useMemo(() => {
    if (tagFilter === "all") return sampleCourses;
    return sampleCourses.filter((course) => course.tags.includes(tagFilter));
  }, [tagFilter]);

  const aiSummary = useMemo(() => buildAiSummary(program, allocation, suggestions), [program, allocation, suggestions]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]"
        >
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <div className="mb-4 flex items-center gap-2">
                <Badge className="rounded-full px-3 py-1 text-xs"><Sparkles className="mr-1 h-3.5 w-3.5" /> AI-Assisted Degree Audit</Badge>
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">Class Credit Checker</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                A website concept for helping students see which classes fulfill degree credits, identify gaps, and use AI assistance to interpret course rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium"><GraduationCap className="h-4 w-4" /> Program</div>
                  <Select value={program} onValueChange={setProgram}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="business">Business Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-2 text-sm font-medium">Progress</div>
                  <div className="mb-3 text-3xl font-semibold">{percentComplete}%</div>
                  <Progress value={percentComplete} className="h-2" />
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-2 text-sm font-medium">Matched Courses</div>
                  <div className="text-3xl font-semibold">{selectedCourses.length}</div>
                  <div className="mt-2 text-sm text-slate-600">Courses detected from student input</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Wand2 className="h-5 w-5" /> AI Recommendation</CardTitle>
              <CardDescription>
                Demo logic showing how an AI layer could summarize progress and suggest next classes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-7 text-slate-700">
                {aiSummary}
              </div>
              <div className="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
                <div className="font-medium text-slate-900">Good production upgrade</div>
                Replace the demo matching engine with a backend endpoint that sends catalog text, program rules, and course history into an LLM with structured output validation.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white p-1 shadow-sm">
            <TabsTrigger value="audit" className="rounded-xl">Audit</TabsTrigger>
            <TabsTrigger value="catalog" className="rounded-xl">Course Catalog</TabsTrigger>
            <TabsTrigger value="planner" className="rounded-xl">Planner</TabsTrigger>
          </TabsList>

          <TabsContent value="audit">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Student Input</CardTitle>
                  <CardDescription>
                    Enter completed classes, transfer credits, or course keywords. The demo automatically matches against known courses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Completed or planned courses</label>
                    <Textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="min-h-[130px] rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Catalog rules or advisor notes</label>
                    <Textarea
                      value={catalogText}
                      onChange={(e) => setCatalogText(e.target.value)}
                      className="min-h-[140px] rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button className="rounded-2xl"><Search className="mr-2 h-4 w-4" /> Analyze Credit Fit</Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => setQuery("STAT 201, ECON 101, ECON 102, ACCT 201, COMM 210")}
                    >
                      Load sample input
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Requirement Coverage</CardTitle>
                    <CardDescription>
                      Each course is allocated to the best-fit requirement bucket in this demo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allocation.remaining.map((req) => {
                      const satisfied = req.remaining <= 0;
                      const completion = Math.min(100, Math.round(((req.creditsNeeded - req.remaining) / req.creditsNeeded) * 100));
                      return (
                        <div key={req.id} className="rounded-2xl bg-slate-100 p-4">
                          <div className="mb-2 flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 font-medium">
                                {satisfied ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                {req.name}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">{req.description}</div>
                            </div>
                            <Badge variant={satisfied ? "default" : "secondary"} className="rounded-full">
                              {satisfied ? "Satisfied" : `${req.remaining} credits left`}
                            </Badge>
                          </div>
                          <Progress value={completion} className="mb-3 h-2" />
                          <div className="flex flex-wrap gap-2">
                            {req.courses.length ? (
                              req.courses.map((course) => (
                                <Badge key={course.code} variant="outline" className="rounded-full bg-white">
                                  {course.code} · {course.credits} cr
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">No classes assigned yet</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Unassigned Courses</CardTitle>
                    <CardDescription>
                      Classes that did not match any current requirement bucket.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allocation.unassigned.length ? (
                        allocation.unassigned.map((course) => (
                          <Badge key={course.code} variant="outline" className="rounded-full">
                            {course.code}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">Everything matched a tracked category.</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="catalog">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">AI Rule Interpretation</CardTitle>
                  <CardDescription>
                    This panel shows where an AI model can help parse policy text, transfer notes, and substitution rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-7 text-slate-700">
                    {catalogText}
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Example structured AI output</AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-2xl bg-slate-100 p-4 font-mono text-xs leading-6 text-slate-700">
                          {`{
  "rule": "PHIL 240 may satisfy Ethics & Society",
  "confidence": 0.91,
  "mapped_requirement": "ethics",
  "notes": "Should be reviewed against the current catalog year"
}`}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Why this matters</AccordionTrigger>
                      <AccordionContent>
                        AI is useful when university rules are written in long paragraphs, when substitutions vary by catalog year, or when transfer equivalencies need human-readable explanations.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-xl">Course Database</CardTitle>
                      <CardDescription>
                        Demo course inventory with category tags used for requirement matching.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <Select value={tagFilter} onValueChange={setTagFilter}>
                        <SelectTrigger className="w-[180px] rounded-xl bg-white">
                          <SelectValue placeholder="Filter by tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All tags</SelectItem>
                          <SelectItem value="math">Math</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="ethics">Ethics</SelectItem>
                          <SelectItem value="cs-core">CS Core</SelectItem>
                          <SelectItem value="business-core">Business Core</SelectItem>
                          <SelectItem value="economics">Economics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredCatalogCourses.map((course) => (
                      <div key={course.code} className="rounded-2xl bg-slate-100 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium">{course.code}</div>
                            <div className="text-sm text-slate-600">{course.title}</div>
                          </div>
                          <Badge className="rounded-full">{course.credits} cr</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="rounded-full bg-white">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planner">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Best Next Classes</CardTitle>
                  <CardDescription>
                    Suggested courses based on remaining requirement gaps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestions.length ? (
                    suggestions.map((group) => (
                      <div key={group.requirement} className="rounded-2xl bg-slate-100 p-4">
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-medium">{group.requirement}</div>
                            <div className="text-sm text-slate-600">{group.remaining} credits still needed</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="space-y-2">
                          {group.matches.length ? group.matches.map((course) => (
                            <div key={course.code} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                              <div>
                                <div className="font-medium">{course.code}</div>
                                <div className="text-slate-600">{course.title}</div>
                              </div>
                              <Badge variant="outline" className="rounded-full">{course.credits} cr</Badge>
                            </div>
                          )) : <div className="text-sm text-slate-500">No demo suggestions available.</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                      No further suggestions. Current sample plan appears complete for the tracked categories.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Implementation Notes</CardTitle>
                  <CardDescription>
                    Recommended architecture for turning this demo into a real product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-slate-700">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <div className="mb-2 font-medium text-slate-900">Frontend</div>
                    Student dashboard, search, audit cards, rule explanations, and degree progress visualizations.
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <div className="mb-2 font-medium text-slate-900">Backend</div>
                    Store official degree rules, course metadata, transfer equivalencies, and catalog-year versions in a structured database.
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <div className="mb-2 font-medium text-slate-900">AI layer</div>
                    Use an LLM for rule extraction, substitution explanations, and conversational recommendations, but require structured JSON output plus human-review safeguards for high-stakes advising.
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <div className="mb-2 font-medium text-slate-900">Important safeguard</div>
                    Always present the result as advisory unless verified against the institution's official audit system.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="flex items-start gap-3 p-6">
              <BookOpen className="mt-0.5 h-5 w-5" />
              <div>
                <div className="font-medium">Catalog-aware</div>
                <div className="mt-1 text-sm text-slate-600">Designed to absorb course rules, transfer guides, and substitution notes.</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="flex items-start gap-3 p-6">
              <Sparkles className="mt-0.5 h-5 w-5" />
              <div>
                <div className="font-medium">AI-assisted matching</div>
                <div className="mt-1 text-sm text-slate-600">Helps interpret ambiguous requirement language and course equivalencies.</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="flex items-start gap-3 p-6">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <div className="font-medium">Actionable planning</div>
                <div className="mt-1 text-sm text-slate-600">Shows what is satisfied, what is missing, and what to take next.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
