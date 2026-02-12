import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const pumpkinCreateSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(10),
  season_start: z.number().int().min(1).max(12).nullable().optional(),
  season_end: z.number().int().min(1).max(12).nullable().optional(),
  taste_profile: z.array(z.string()).default([]),
  texture: z.array(z.string()).default([]),
  best_for: z.array(z.string()).default([]),
  nutrition: z.record(z.any()).default({})
});

export const recipeCreateSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
  instructions: z.array(z.string()).default([])
});
