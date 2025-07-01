import { measurementSchema, rawMeasurementSchema, convertRawMeasurement } from "@/lib/measurements";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestBody = z.object({
    activity: z.string().min(1),
    measurement: rawMeasurementSchema,
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsedBody = requestBody.parse(body);

        const convertedMeasurement = convertRawMeasurement(parsedBody.measurement);

        const result = await fetch('https://preview.api.climatiq.io/autopilot/v1-preview3/estimate', {
            method: 'POST',
            body: JSON.stringify({
                text: parsedBody.activity,
                domain: 'general',
                parameters: {
                    ...convertedMeasurement,
                },
                region: 'NO',
            }),
            headers: {
                'Authorization': `Bearer ${process.env.CLIMATIC_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await result.json();

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "There was an error processing your request" }, { status: 500 });
    }
}