import { defineAction } from "astro:actions";
import { z } from "zod";

// Define the order schema
const orderSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    service: z.enum(["Lösa bilder", "Album", "Andra behov", "Övrigt"]),
    message: z.string(),
});

// Infer the type from the schema
type OrderInput = z.infer<typeof orderSchema>;

export const server = {
    order: defineAction({
        accept: "form",
        schema: orderSchema,
        handler: async ({ name, email, service, message }: OrderInput) => {
            // Here you can handle the order data
            console.log({ name, email, service, message });
            return {
                success: true,
                message: "Tack för din bokning!"
            };
        }
    })
}