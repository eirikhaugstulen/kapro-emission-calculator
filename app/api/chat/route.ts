import { NextRequest } from "next/server";
import { convertToModelMessages, stepCountIs, streamText } from 'ai';
import { anthropic } from "@ai-sdk/anthropic";
import { CustomMessage } from "@/lib/ai";
import { findActivityIdSystemMessage } from "@/lib/ai/system-message";
import { createFindActivityIdTool } from "@/lib/ai/tools/findActivityId";
import { ActivitySubmission } from "@/components/activity-form/activity-form";
import { createCalculateEmissionTool } from "@/lib/ai/tools/calculateEmission";

type ChatRequest = {
  messages: CustomMessage[];
  submittedActivity: ActivitySubmission;
}

export async function POST(request: NextRequest) {
  const body: ChatRequest = await request.json();
  const { messages, submittedActivity } = body;

  const findActivityId = createFindActivityIdTool({
    createdAt: new Date().toISOString(),
    activity: submittedActivity.activity,
    measurement: submittedActivity.measurement,
  });

  const calculateEmission = createCalculateEmissionTool({
    createdAt: new Date().toISOString(),
    activity: submittedActivity.activity,
    measurement: submittedActivity.measurement,
  });

  const stream = streamText({
    model: anthropic("claude-4-sonnet-20250514"),
    messages: convertToModelMessages(messages),
    system: findActivityIdSystemMessage,
    tools: {
      findActivityId,
      calculateEmission,
    },
    stopWhen: stepCountIs(100),
  });

  return stream.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}