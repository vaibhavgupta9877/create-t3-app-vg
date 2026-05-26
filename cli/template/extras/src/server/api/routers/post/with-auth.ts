import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(1, "Text is required")
          .max(255, "Text must be under 255 characters")
          .trim(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name is required")
          .max(255, "Name must be under 255 characters")
          .trim(),
      })
    )
    .mutation(async ({ input }) => {
      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: protectedProcedure.query(() => {
    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
