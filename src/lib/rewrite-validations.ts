import { z } from "zod"

const contactInfoSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
})

const experienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  duration: z.string(),
  description: z.string(),
  location: z.string().optional(),
})

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  hasGithub: z.boolean(),
  hasLiveLink: z.boolean(),
})

export const profileDataSchema = z.object({
  headline: z.string(),
  about: z.string(),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
      field: z.string().optional(),
    })
  ),
  certifications: z.array(z.string()),
  projects: z.array(projectSchema),
  links: z.array(z.string()),
  contactInfo: contactInfoSchema,
  rawText: z.string(),
})

export const rewriteRequestSchema = z.object({
  section: z.enum(["headline", "about"]),
  original: z.string().max(8000),
  profileData: profileDataSchema,
  mode: z.enum(["startup", "faang", "recruiter", "internship"]),
})

export type RewriteRequest = z.infer<typeof rewriteRequestSchema>
