import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPartsByVehicle, getDiagramUrl } from '../api/client';

export default function VehiclePartsPage() {
  const { vehicleId } = useParams();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDiagram, setActiveDiagram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search query
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPartsByVehicle(vehicleId, page, 48, debouncedSearch)
      .then(setData)
      .catch(() => setError('Could not load parts for this vehicle.'))
      .finally(() => setLoading(false));
  }, [vehicleId, page, debouncedSearch]);

  const vehicle = data?.vehicle;
  const parts = data?.data || [];

  function openDiagram(part) {
    if (!part.picId || !vehicle?.vin) return;
    const url = getDiagramUrl(vehicle.vin, part.picId);
    setActiveDiagram({
      url,
      picId: part.picId,
      partName: part.partName,
      partNumber: part.partNumber,
    });
  }

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to VIN Search
        </Link>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <p>Loading vehicle catalog and parts...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: 16, background: '#fee2e2', color: '#b91c1c', borderRadius: 8, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Vehicle Metadata Header Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#2563eb',
                    background: '#dbeafe',
                    padding: '3px 8px',
                    borderRadius: 4,
                    marginBottom: 6,
                  }}
                >
                  {vehicle?.make || 'VEHICLE'}
                </span>
                <h1 style={{ margin: '0 0 6px', fontSize: 24, color: '#0f172a' }}>
                  {vehicle?.modelDescription || vehicle?.model || 'Vehicle Parts Catalog'}
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
                  Year: <strong>{vehicle?.modelYear || 'N/A'}</strong> {vehicle?.series ? `| Series: ${vehicle.series}` : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>CONFIRMED VIN</span>
                <code
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    background: '#1e293b',
                    color: '#38bdf8',
                    padding: '6px 12px',
                    borderRadius: 6,
                    letterSpacing: '0.05em',
                  }}
                >
                  {vehicle?.vin}
                </code>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ color: '#475569', fontSize: 14 }}>
              Showing <strong>{parts.length}</strong> of <strong>{data.totalCount}</strong> parts (Page {data.page} of {data.totalPages || 1})
            </div>
            <input
              type="text"
              placeholder="Search by part number, name, or group across all pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                width: 380,
                fontSize: 14,
              }}
            />
          </div>

          {/* Parts Catalog Table */}
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: '#334155' }}>Part Number</th>
                  <th style={{ padding: '12px 14px', color: '#334155' }}>Description</th>
                  <th style={{ padding: '12px 14px', color: '#334155' }}>Group / Subgroup</th>
                  <th style={{ padding: '12px 14px', color: '#334155', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '12px 14px', color: '#334155' }}>Price & Availability</th>
                  <th style={{ padding: '12px 14px', color: '#334155', textAlign: 'center' }}>Schematic</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                      {part.partNumber || <span style={{ color: '#94a3b8' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 500, color: '#1e293b' }}>{part.partName}</div>
                      {part.partNameOriginal && part.partNameOriginal !== part.partName && (
                        <div style={{ fontSize: 12, color: '#64748b' }}>Original: {part.partNameOriginal}</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      <div>{part.groupName || '—'}</div>
                      {part.subGroupName && <div style={{ fontSize: 12, color: '#94a3b8' }}>{part.subGroupName}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#334155' }}>
                      {part.quantity}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {part.price != null ? (
                        <div>
                          <span style={{ fontWeight: 700, color: '#15803d', fontSize: 15 }}>
                            {part.currency || 'USD'} {Number(part.price).toFixed(2)}
                          </span>
                          {part.origin && (
                            <span
                              style={{
                                display: 'inline-block',
                                marginLeft: 6,
                                fontSize: 11,
                                padding: '2px 6px',
                                background: '#dcfce7',
                                color: '#166534',
                                borderRadius: 4,
                              }}
                            >
                              {part.origin}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: 13 }}>Quote on Request</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      {part.picId ? (
                        <button
                          onClick={() => openDiagram(part)}
                          style={{
                            padding: '6px 10px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          🖼️ View #{part.picId}
                        </button>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: page <= 1 ? '#f1f5f9' : '#fff',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                color: page <= 1 ? '#94a3b8' : '#334155',
                fontWeight: 500,
              }}
            >
              ← Previous Page
            </button>
            <span style={{ color: '#64748b', fontSize: 14 }}>
              Page <strong>{page}</strong> of <strong>{data.totalPages}</strong>
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: page >= data.totalPages ? '#f1f5f9' : '#fff',
                cursor: page >= data.totalPages ? 'not-allowed' : 'pointer',
                color: page >= data.totalPages ? '#94a3b8' : '#334155',
                fontWeight: 500,
              }}
            >
              Next Page →
            </button>
          </div>
        </>
      )}

      {/* Exploded Assembly Diagram Modal */}
      {activeDiagram && (
        <div
          onClick={() => setActiveDiagram(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>
                  Exploded Assembly Schematic (Pic #{activeDiagram.picId})
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
                  {activeDiagram.partNumber ? `Part PN: ${activeDiagram.partNumber} — ` : ''}
                  {activeDiagram.partName}
                </p>
              </div>
              <button
                onClick={() => setActiveDiagram(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Diagram Image */}
            <div
              style={{
                padding: 24,
                overflowY: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                minHeight: 350,
              }}
            >
              <img
                src={activeDiagram.url}
                alt={`Schematic for Pic ${activeDiagram.picId}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  border: '1px solid #f1f5f9',
                  borderRadius: 4,
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', textAlign: 'center', padding: 40, color: '#64748b' }}>
                <p style={{ fontSize: 32, margin: '0 0 8px' }}>📋</p>
                <p style={{ fontWeight: 600, color: '#334155' }}>Diagram illustration #{activeDiagram.picId}</p>
                <p style={{ fontSize: 13 }}>This technical diagram is indexed for this sub-assembly.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f8fafc',
              }}
            >
              <a
                href={activeDiagram.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#2563eb', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}
              >
                Open Full Resolution in New Tab ↗
              </a>
              <button
                onClick={() => setActiveDiagram(null)}
                style={{
                  padding: '6px 14px',
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}