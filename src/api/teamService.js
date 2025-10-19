import axios from "axios";

const API_URL = "http://localhost:5000/api/teams";

export const getTeams = async () => axios.get(API_URL);
export const createTeam = async (data) => axios.post(API_URL, data);
export const updateTeam = async (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteTeam = async (id) => axios.delete(`${API_URL}/${id}`);
export const bulkDeleteTeams = async (ids) =>
  axios.delete(API_URL, { data: { ids } });
export const updateStatus = async (id, field, value) =>
  axios.put(`${API_URL}/${id}/status`, { field, value });
export const reorderTeams = async (order) =>
  axios.put(`${API_URL}/order`, { order });
export const updateMember = async (teamId, memberId, data) => {
  const team = await axios.get(`${API_URL}/${teamId}`);
  const updatedMembers = team.data.members.map((m, idx) =>
    m._id === memberId || idx === memberId ? { ...m, ...data } : m
  );
  return axios.put(`${API_URL}/${teamId}`, {
    ...team.data,
    members: updatedMembers,
  });
};
export const deleteMember = async (teamId, memberId) => {
  const team = await axios.get(`${API_URL}/${teamId}`);
  const updatedMembers = team.data.members.filter(
    (m, idx) => m._id !== memberId && idx !== memberId
  );
  return axios.put(`${API_URL}/${teamId}`, {
    ...team.data,
    members: updatedMembers,
  });
};
