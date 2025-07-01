import { tool } from "ai"
import { CustomMessage } from "../chat-schema"
import { z } from "zod";
import { convertRawMeasurement } from "@/lib/measurements";

type Metadata = CustomMessage['metadata']

export const createCalculateEmissionTool = (metadata: Metadata) => tool({
    inputSchema: z.object({
        activity_id: z.string(),
    }),
    outputSchema: z.object({
        co2e: z.number(),
        unit: z.string(),
        activity_name: z.string(),
        activity_id: z.string(),
    }),
    description: 'Calculate the emission of an activity after finding the correct id',
    execute: async ({ activity_id }) => {
        if (!metadata?.measurement) {
            throw new Error('Could not find measurement');
        }
        const { amount, unit, domain } = metadata.measurement;
        const measurement = convertRawMeasurement({
            amount,
            unit,
            domain,
        });
        
        const result = await fetch('https://api.climatiq.io/data/v1/estimate', {
            method: 'POST',
            body: JSON.stringify({
                emission_factor: {
                    activity_id,
                    data_version: '^23',
                    region: 'NO',
                },
                parameters: {
                    ...measurement,
                },
            }),
            headers: {
                'Authorization': `Bearer ${process.env.CLIMATIC_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await result.json();

        if (data.error) {
            throw new Error(data.error_message);
        }

        return {
            co2e: data.co2e,
            unit: data.co2e_unit,
            activity_name: data.emission_factor.name,
            activity_id: data.emission_factor.activity_id,  
        };
    },
});