import type { AnalysisResult } from "@/types"

/** Static demo report for /analyze/demo — no PDF or API required. */
export const DEMO_ANALYSIS_ID = "demo"

export const DEMO_ANALYSIS: AnalysisResult = {
  analysisId: DEMO_ANALYSIS_ID,
  createdAt: "2026-05-17T12:00:00.000Z",
  profile: {
    headline: "Software Engineer | React, Node.js, AWS | 3 yrs shipping production features",
    about:
      "Full-stack engineer focused on user-facing products at early-stage startups. I build React frontends, Node APIs, and deploy on AWS. Recent work includes a payments dashboard used by 12k merchants and an internal hiring tool that cut recruiter review time by 40%.",
    skills: [
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Docker",
      "REST APIs",
      "Git",
    ],
    experience: [
      {
        title: "Software Engineer",
        company: "NovaPay",
        duration: "2023 – Present",
        location: "Remote",
        description:
          "Built merchant analytics dashboard (React, Node). Reduced page load 35% via code-splitting. Owned on-call rotation for payment webhooks.",
      },
      {
        title: "Junior Developer",
        company: "Stacklane",
        duration: "2021 – 2023",
        location: "Bengaluru",
        description:
          "Shipped 8 customer-facing features in React. Migrated legacy jQuery pages. Wrote integration tests with Jest.",
      },
    ],
    education: [
      {
        degree: "B.Tech Computer Science",
        institution: "State University",
        year: "2021",
      },
    ],
    certifications: ["AWS Cloud Practitioner"],
    projects: [
      {
        name: "OpenHire",
        description:
          "Open-source applicant tracker with AI resume parsing. 240 GitHub stars.",
        techStack: ["Next.js", "PostgreSQL", "Groq"],
        hasGithub: true,
        hasLiveLink: true,
      },
    ],
    links: ["github.com/alexdemo", "alexdemo.dev"],
    contactInfo: {
      name: "Alex Chen",
      email: "alex.chen@example.com",
      location: "Remote · India",
      linkedinUrl: "https://linkedin.com/in/alexdemo",
      githubUrl: "https://github.com/alexdemo",
    },
    rawText: "[Demo profile — not parsed from a real PDF]",
  },
  analysis: {
    overallScore: 72,
    sectionScores: [
      {
        section: "Headline",
        score: 12,
        maxScore: 15,
        weight: 15,
        signals: ["Role clear", "Stack listed", "Years of experience"],
        missing: ["No quantified outcome in headline"],
      },
      {
        section: "About",
        score: 7,
        maxScore: 10,
        weight: 10,
        signals: ["Specific projects", "Metrics in body"],
        missing: ["Could tighten opening line"],
      },
      {
        section: "Experience",
        score: 14,
        maxScore: 20,
        weight: 20,
        signals: ["Recent role relevant", "Some metrics"],
        missing: ["Junior role bullets light on impact", "Missing team scope"],
      },
      {
        section: "Projects",
        score: 14,
        maxScore: 20,
        weight: 20,
        signals: ["Live link", "GitHub stars as social proof"],
        missing: ["Only one project listed"],
      },
      {
        section: "Skills",
        score: 7,
        maxScore: 10,
        weight: 10,
        signals: ["ATS-friendly stack"],
        missing: ["No endorsements context"],
      },
      {
        section: "ATS Keywords",
        score: 10,
        maxScore: 15,
        weight: 15,
        signals: ["React", "Node", "AWS present"],
        missing: ["Missing CI/CD, system design keywords for senior roles"],
      },
      {
        section: "Personal Branding",
        score: 8,
        maxScore: 10,
        weight: 10,
        signals: ["GitHub linked", "Portfolio domain"],
        missing: [],
      },
    ],
    firstImpression:
      "Readable mid-level IC profile — I know what you build and with what stack within 6 seconds. Not standout yet because impact numbers are buried in the about section instead of the headline and first bullets.",
    strengths: [
      "Headline names role, stack, and tenure — passes the skim test",
      "About section cites real metrics (12k merchants, 40% time saved)",
      "GitHub project with traction signals you ship outside work hours",
    ],
    weaknesses: [
      "Experience bullets read like task lists — too few outcomes per line",
      "Only one project visible; recruiters expect 2+ for mid-level SWE",
      "Headline missing a single hard metric recruiters can remember",
    ],
    recruiterConcerns: [
      "NovaPay bullets don't state team size or business impact in dollars/%",
      "Profile optimized for startup generalist, not FAANG keyword density",
    ],
    hireabilityAssessment:
      "Shortlistable for mid-level startup/backend-leaning roles if the hiring manager cares about shipping speed. For competitive FAANG loops you'd get filtered at resume screen — metrics are present but not loud enough in experience, and system design signals are thin. Fix headline + top 2 bullets before applying to tier-1 companies.",
    improvementPriorities: [
      "Rewrite headline to lead with one metric: e.g. '3 yrs · React/Node · cut recruiter review 40%'",
      "Add 2 quantified bullets to NovaPay (latency %, revenue, users, incidents)",
      "Add a second project with stack + link — recruiters scan for proof of breadth",
    ],
    profileSummary:
      "Mid-level full-stack engineer with credible startup experience but under-marketed impact on the first screen.",
  },
}
