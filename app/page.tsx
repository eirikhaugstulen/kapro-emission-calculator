"use client"

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CustomMessage } from "@/lib/ai";
import { Message } from "@/components/message/message";
import { ActivityForm, ActivitySubmission } from "@/components/activity-form/activity-form";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Autopilot } from "@/components/autopilot";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [submittedActivity, setSubmittedActivity] = useState<ActivitySubmission | null>(null)
  const lastSentActivity = useRef<ActivitySubmission | undefined>(undefined)
  const { messages, sendMessage, setMessages, status, error } = useChat<CustomMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: function ({ id, messages, trigger, messageId }) {
        return {
          body: {
            submittedActivity: lastSentActivity.current,
            messages: messages,
            messageId: messageId,
            id: id,
            trigger: trigger,
          }
        }
      },
    }),
  });

  const handleSubmit = (data: ActivitySubmission) => {
    setMessages([]);
    setSubmittedActivity(data);
  }

  useEffect(() => {
    if (submittedActivity?.activity && lastSentActivity.current !== submittedActivity) {
      lastSentActivity.current = submittedActivity;
      debugger;
      sendMessage({
        text: `Activity: "${submittedActivity.activity}"\nMeasurement: "${JSON.stringify(submittedActivity.measurement)}"`,
        metadata: {
          createdAt: new Date().toISOString(),
          activity: submittedActivity.activity,
          measurement: submittedActivity.measurement,
        },
      });
    }
  }, [submittedActivity, sendMessage]);

  return (
    <div className="h-screen p-8 flex flex-col">
      <main className="max-w-[90%] mx-auto flex flex-col w-full">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-2xl font-bold text-center">
            Utslippskalkulator
          </h1>
        </div>

        <div className="flex flex-col md:flex-row flex-1 gap-2 overflow-y-auto overflow-x-hidden">
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Alternativ 1</CardTitle>
            </CardHeader>

            <ScrollArea className="h-[calc(80vh-200px)] px-4">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                />
              ))}

              {status === "submitted" && (
                <div className="flex gap-2 items-center justify-center h-full">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <p className="text-sm text-red-500">
                    Noe gikk galt.
                  </p>
                  <p className="text-sm text-red-500">
                    {error?.message}
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Alternativ 2</CardTitle>
            </CardHeader>

            <ScrollArea className="h-[calc(80vh-200px)] px-4 overflow-x-auto">
              <Autopilot submittedActivity={submittedActivity} />
            </ScrollArea>
          </Card>
        </div>

        <div className="mt-4">
          <ActivityForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
