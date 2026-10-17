import type { ConfigJob, ConfigPreview, ConfigRequest } from "@/types";
import { post, request } from "./client";

export const previewConfig = (input: ConfigRequest, signal?: AbortSignal) =>
  request<ConfigPreview>("/automation/preview", { method: "POST", body: JSON.stringify(input), signal });

export const queueConfigJob = (input: ConfigRequest) => post<ConfigJob>("/automation/jobs", input);
