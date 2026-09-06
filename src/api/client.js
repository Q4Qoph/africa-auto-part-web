export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003';

export async function lookupVin(vin) {
  const res = await fetch(`${BASE_URL}/api/vehicles/vin/${encodeURIComponent(vin)}`);
  if (!res.ok) {
    throw new Error(`Lookup failed: ${res.status}`);
  }
  return res.json();
}

export async function getPartsByVehicle(vehicleId, page = 1, pageSize = 48, search = '', group = '') {
  const params = new URLSearchParams({ page, pageSize });
  if (search && search.trim()) params.append('search', search.trim());
  if (group && group.trim()) params.append('group', group.trim());

  const res = await fetch(`${BASE_URL}/api/parts/by-vehicle/${vehicleId}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Parts fetch failed: ${res.status}`);
  }
  return res.json();
}

export function getDiagramUrl(vin, picId) {
  if (!vin || !picId) return null;
  return `${BASE_URL}/diagrams/${encodeURIComponent(vin)}/${encodeURIComponent(picId)}.png`;
}