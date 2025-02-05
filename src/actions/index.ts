import { defineAction, z } from "astro:actions";

export const server = {
    order: defineAction({
accept:"form",
input: z.object({
    name: z.string(),
    email: z.string().email(),
    service: z.enum(["Lösa bilder", "Album", "Andra behov", "Övrigt"]),
    message: z.string(),
}),
handler: async (order) => {
    return "Tack för din bokning!"
    }
})
}