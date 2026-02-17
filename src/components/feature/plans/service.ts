export const deletePlanService = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return await fetch(`${baseUrl}/api/plans/${id}`, {
    method: "DELETE",
  });
};

export const createPlanService = async (payload: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return await fetch(`${baseUrl}/api/plans`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updatePlanService = async (id: string, payload: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return await fetch(`${baseUrl}/api/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

