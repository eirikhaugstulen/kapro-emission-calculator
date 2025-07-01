import { tool } from "ai";
import z from "zod";

const inputSchema = z.object({
    city: z.string().describe('The city to get the weather for. Make sure it\'s human readable and capitalized.'),
});

const outputSchema = z.object({
    temperature: z.number().describe('The temperature in Celsius'),
    description: z.string().describe('A short description of the weather'),
});

export const getWeather = tool({
    inputSchema,
    outputSchema,
    description: 'Get the weather for a given city',
    execute: async () => {
        // mock data
        await new Promise(resolve => setTimeout(resolve, 3000));

        return {
            temperature: Math.floor(Math.random() * 10) + 10,
            description: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Foggy', 'Windy'][Math.floor(Math.random() * 6)],
        };
    },
});