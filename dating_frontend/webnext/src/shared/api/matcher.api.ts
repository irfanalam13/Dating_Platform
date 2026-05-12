// import api from "./client";

// export interface AcceptedMatch {
//   id: number;
//   user_id: number;
//   email: string;
//   name: string;
//   profile_id: number | null;
//   profile_image: string | null;
// }

// export interface PendingMatch {
//   id: number;
//   sender?: string;
//   receiver?: string;
//   status: string;
// }

// export const getAcceptedMatches = async (): Promise<AcceptedMatch[]> => {
//   const res = await api.get("/matcher/accepted/");
//   return res.data;
// };

// export const getReceivedMatches = async (): Promise<PendingMatch[]> => {
//   const res = await api.get("/matcher/received/");
//   return res.data;
// };

// export const acceptMatch = async (matchId: number): Promise<{ message: string }> => {
//   const res = await api.post(`/matcher/accept/${matchId}/`);
//   return res.data;
// };

// export const rejectMatch = async (matchId: number): Promise<{ message: string }> => {
//   const res = await api.post(`/matcher/reject/${matchId}/`);
//   return res.data;
// };



import api from "./client";
import type { AcceptedMatch, PendingMatch } from "../types/matcher.types";

export const getAcceptedMatches = async (): Promise<AcceptedMatch[]> => {
  const res = await api.get("/matcher/accepted/");
  console.log("✅ ACCEPTED:", res.data); // ← remove after confirming shape
  return Array.isArray(res.data) ? res.data : res.data?.results ?? [];
};

export const getReceivedMatches = async (): Promise<PendingMatch[]> => {
  const res = await api.get("/matcher/received/");
  console.log("📥 RECEIVED:", res.data); // ← remove after confirming shape
  return Array.isArray(res.data) ? res.data : res.data?.results ?? [];
};

export const acceptMatch = async (matchId: number): Promise<{ message: string }> => {
  const res = await api.post(`/matcher/accept/${matchId}/`);
  return res.data;
};

export const rejectMatch = async (matchId: number): Promise<{ message: string }> => {
  const res = await api.post(`/matcher/reject/${matchId}/`);
  return res.data;
};