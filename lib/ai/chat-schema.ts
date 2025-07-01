import { UIMessage, UIDataTypes, InferUITool } from "ai";
import { z } from "zod";
import { createFindActivityIdTool } from "./tools/findActivityId";
import { rawMeasurementSchema } from "@/lib/measurements";
import { createCalculateEmissionTool } from "./tools/calculateEmission";

export const metadataSchema = z.object({
  createdAt: z.string(),
  activity: z.string().optional(),
  measurement: rawMeasurementSchema.optional(),
});

type findActivityIdTool = InferUITool<ReturnType<typeof createFindActivityIdTool>>
type calculateEmissionTool = InferUITool<ReturnType<typeof createCalculateEmissionTool>>

export type CustomMessage = UIMessage<
  z.infer<typeof metadataSchema>,
  UIDataTypes,
  {
    findActivityId: findActivityIdTool,
    calculateEmission: calculateEmissionTool,
  }
>

export type CustomMessageMetadata = z.infer<typeof metadataSchema>;