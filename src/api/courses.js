import api from "../lib/api";

export async function fetchCategories() {
  const { data } = await api.get("/courses/categories");
  // data: [{ name, image }]
  return data ?? [];
}

export async function fetchCourses({ q = "", page = 1, limit = 12, category } = {}) {
  const params = { q, page, limit, ...(category ? { category } : {}) };
  const { data } = await api.get("/courses", { params });
  // expect { items, total, page, limit }
  return {
    items: data.items ?? [],
    total: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
}
