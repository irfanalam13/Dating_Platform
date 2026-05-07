import api from "./client";

export interface CollegeModeHome {
  verification_status: string;
  sections: { id: string; title: string; description: string }[];
}

export const getCollegeMode = async (): Promise<CollegeModeHome> => {
  const res = await api.get("/college-mode/");
  return res.data;
};

export const submitStudentVerification = async (data: FormData) => {
  const res = await api.post("/college-mode/verification/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
