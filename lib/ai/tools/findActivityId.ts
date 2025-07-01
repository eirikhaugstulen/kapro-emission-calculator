import { tool } from "ai";
import { z } from "zod";
import { CustomMessage } from "../chat-schema";

type Metadata = CustomMessage['metadata']

const outputSchema = z.object({
    total_results: z.number(),
    results: z.array(z.object({
        activity_id: z.string(),
        name: z.string(),
        description: z.string(),
        sector: z.string(),
        category: z.string(),
        unit_type: z.string(),
    })),
});

export const createFindActivityIdTool = (metadata: Metadata) => tool({
    inputSchema: z.object({
        query: z.string()
            .describe('A free text query resembling the emission activity (e.g. "electricity" or "Fertilizer"). Do not include a query term in the first call.')
            .optional(),
        category: z.string()
            .describe('The category of the emission activity (e.g. "Energy" or "Fertilizer").')
            .optional(),
        page: z.number()
            .describe('The page number of the results to return. Default is 1.')
            .default(1)
            .optional(),
        disable_unit_type_filter: z.boolean()
            .describe(
                'Filters the results to only include activities where the unit type matches what the user has provided.' +
                'It defaults to false, but can be turned on if the function consecutively returns no results. Use with caution as this can lead to not being able to convert the emission into a result. DEFAULTS TO FALSE.'
            )
            .default(false)
            .optional(),
    }),
    outputSchema,
    description: 'Find relevant activity id with emission factor for the given emission activity',
    execute: async ({ query, category, page, disable_unit_type_filter }) => {
        const queryString = new URLSearchParams();
        if (query) {
            queryString.set('query', query);
        }
        if (category) {
            queryString.set('category', category);
        }
        if (page) {
            queryString.set('page', page.toString());
        }
        if (!disable_unit_type_filter) {
            if (metadata?.measurement && metadata.measurement.domain) {
                queryString.set('unit_type', metadata.measurement.domain.toLowerCase());
            }
        }
        queryString.set('results_per_page', '10');
        queryString.set('data_version', '23');
        queryString.set('region', 'NO');

        try {
            const result = await fetch(`https://api.climatiq.io/data/v1/search?${queryString.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.CLIMATIC_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!result.ok) {
                console.error('Error in findActivityId tool:', result.statusText);
                throw new Error('Error in upstream api call');
            }

            const data = await result.json() as z.infer<typeof outputSchema>;

            // Map through the data to remove unnecessary fields
            const results = data.results.map((result) => ({
                activity_id: result.activity_id,
                name: result.name,
                description: result.description,
                sector: result.sector,
                category: result.category,
                unit_type: result.unit_type,
            }));

            return { results, total_results: data.total_results };
        } catch (error) {
            console.error('Error in findActivityId tool:', error);
            throw error;
        }
    },
});