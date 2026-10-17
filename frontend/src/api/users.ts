import type { User, UserUpdate } from "@/types";
import { get, put } from "./client";

export const getUser = (id: number, signal?: AbortSignal) => get<User>(`/users/${id}`, signal);
export const updateUser = (id: number, input: UserUpdate) => put<User>(`/users/${id}`, input);
