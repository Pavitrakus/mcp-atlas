import { z } from "zod";

export const requestInput = z.object({
  title: z.string().trim().min(3).max(80),
  wish: z.string().trim().min(12).max(600),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  platform: z.string().trim().max(80).optional().or(z.literal("")),
  workflow: z.string().trim().max(400).optional().or(z.literal("")),
  client: z.string().trim().max(40).optional().or(z.literal("")),
  hosting: z.enum(["local", "remote", "either", ""]).optional(),
  reference: z.string().trim().max(200).optional().or(z.literal("")),
  author: z.string().trim().max(60).optional().or(z.literal("")),
});

export const commentInput = z.object({
  body: z.string().trim().min(2).max(800),
  author: z.string().trim().max(60).optional().or(z.literal("")),
});

export const submissionNote = z.object({
  note: z.string().trim().max(400).optional().or(z.literal("")),
});

export const CLIENTS = ["cursor", "claude", "vscode", "claude-code", "generic"] as const;
