// file: src/mockSearch.ts

type AnyRecord = Record<string, unknown>;

// Some mock data you can extend
const mockData: AnyRecord[] = [
  {
    id: 1,
    name: "Green Tea Mug",
    price: 299,
    createdAt: "2024-11-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 4999,
    createdAt: "2025-01-12T06:00:00Z",
  },
  { id: 3, name: "Desk Lamp", price: 1499, createdAt: "2025-06-01T12:00:00Z" },
  {
    id: 4,
    name: "Office Chair",
    price: 8999,
    createdAt: "2024-12-01T08:00:00Z",
  },
  { id: 5, name: "USB-C Cable", price: 399, createdAt: "2025-02-14T03:00:00Z" },
];

/**
 * Simple mock search function
 * @param query text to search for
 * @returns Promise resolving to filtered mock data
 */
export async function mockSearch(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return mockData; // if no query, return all

  const results = mockData.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(q))
  );

  // simulate network delay
  await new Promise((res) => setTimeout(res, 300));

  return results;
}
