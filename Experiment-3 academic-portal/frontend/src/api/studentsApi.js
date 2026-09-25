import api from "./axios";

const BASE = "/students";

export const getAll = (params) => api.get(BASE, { params }).then((r) => r.data);
export const getOne = (id) => api.get(`${BASE}/${id}`).then((r) => r.data);
export const create = (payload) => api.post(BASE, payload).then((r) => r.data);
export const update = (id, payload) => api.put(`${BASE}/${id}`, payload).then((r) => r.data);
export const remove = (id) => api.delete(`${BASE}/${id}`).then((r) => r.data);
