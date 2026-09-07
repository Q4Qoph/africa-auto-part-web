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
    <div style={{ maxWidth: 1080, margin: '36px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          to="/"
          style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back to VIN Search
        </Link>
      </div>

      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 16 }}>Loading vehicle catalog and parts...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--error-bg)',
            color: 'var(--error-text)',
            border: '1px solid var(--error-border)',
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Vehicle Metadata Header Card */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '22px 26px',
              marginBottom: 24,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    background: 'var(--primary-bg-subtle)',
                    border: '1px solid var(--primary-border)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    marginBottom: 8,
                    letterSpacing: '0.04em',
                  }}
                >
                  {vehicle?.make || 'VEHICLE'}
                </span>
                <h1 style={{ margin: '0 0 6px', fontSize: 24, color: 'var(--text-primary)', fontWeight: 700 }}>
                  {vehicle?.modelDescription || vehicle?.model || 'Vehicle Parts Catalog'}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, fontSize: 13 }}>
                  {vehicle?.generationCoverage && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Catalog Coverage: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.generationCoverage}</strong></span>}
                  {vehicle?.modelYear && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Base Year: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.modelYear}</strong></span>}
                  {vehicle?.series && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Series: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.series}</strong></span>}
                  {vehicle?.engine && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Engine: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.engine}</strong></span>}
                  {vehicle?.transmission && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Transmission: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.transmission}</strong></span>}
                  {vehicle?.steering && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Drive: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.steering}</strong></span>}
                  {vehicle?.fuelType && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Fuel: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.fuelType}</strong></span>}
                  {vehicle?.regionalSpec && <span style={{ background: 'var(--chip-bg)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Spec: <strong style={{ color: 'var(--text-secondary)' }}>{vehicle.regionalSpec}</strong></span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  CONFIRMED BATCH / VIN
                </span>
                <code
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    background: 'var(--bg-card-subtle)',
                    color: '#38bdf8',
                    border: '1px solid var(--border)',
                    padding: '6px 12px',
                    borderRadius: 6,
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--font-mono)',
                    display: 'inline-block',
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
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Showing <strong style={{ color: 'var(--text-secondary)' }}>{parts.length}</strong> of{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>{data.totalCount}</strong> parts (Page {data.page} of {data.totalPages || 1})
            </div>
            <input
              type="text"
              placeholder="Search by part number, name, or group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                width: 360,
                fontSize: 14,
                boxShadow: 'var(--shadow-sm)',
              }}
            />
          </div>

          {/* Parts Catalog Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--table-border)', borderRadius: 10, boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, background: 'var(--bg-card)' }}>
              <thead>
                <tr style={{ background: 'var(--table-head-bg)', borderBottom: '2px solid var(--table-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Part Number</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Group / Subgroup</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Price & Availability</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Schematic</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid var(--table-border)',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {part.partNumber || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{part.partName}</div>
                      {part.partNameOriginal && part.partNameOriginal !== part.partName && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Original: {part.partNameOriginal}</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      <div>{part.groupName || '—'}</div>
                      {part.subGroupName && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{part.subGroupName}</div>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {part.quantity}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {part.price != null ? (
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--success-text)', fontSize: 15 }}>
                            {part.currency || 'USD'} {Number(part.price).toFixed(2)}
                          </span>
                          {part.origin && (
                            <span
                              style={{
                                display: 'inline-block',
                                marginLeft: 8,
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '2px 6px',
                                background: 'var(--success-bg)',
                                color: 'var(--success-text)',
                                border: '1px solid var(--success-border)',
                                borderRadius: 4,
                              }}
                            >
                              {part.origin}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Quote on Request</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      {part.picId ? (
                        <button
                          type="button"
                          onClick={() => openDiagram(part)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--primary-bg-subtle)',
                            color: 'var(--primary)',
                            border: '1px solid var(--primary-border)',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'background-color 0.15s',
                          }}
                        >
                          🖼️ View #{part.picId}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
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
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: page <= 1 ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: 500,
                fontSize: 14,
                transition: 'background-color 0.15s',
              }}
            >
              ← Previous Page
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Page <strong style={{ color: 'var(--text-secondary)' }}>{page}</strong> of{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>{data.totalPages}</strong>
            </span>
            <button
              type="button"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: page >= data.totalPages ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
                cursor: page >= data.totalPages ? 'not-allowed' : 'pointer',
                color: page >= data.totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: 500,
                fontSize: 14,
                transition: 'background-color 0.15s',
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
            backgroundColor: 'var(--modal-overlay)',
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
              backgroundColor: 'var(--bg-card)',
              borderRadius: 14,
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 22px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--table-head-bg)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text-primary)', fontWeight: 700 }}>
                  Exploded Assembly Schematic (Pic #{activeDiagram.picId})
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {activeDiagram.partNumber ? `Part PN: ${activeDiagram.partNumber} — ` : ''}
                  {activeDiagram.partName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDiagram(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
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
                background: '#ffffff', // Keep technical schematic canvas crisp white
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
                padding: '14px 22px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--table-head-bg)',
              }}
            >
              <a
                href={activeDiagram.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
              >
                Open Full Resolution in New Tab ↗
              </a>
              <button
                type="button"
                onClick={() => setActiveDiagram(null)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
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