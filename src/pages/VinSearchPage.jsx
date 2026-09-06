import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lookupVin } from '../api/client';

export default function VinSearchPage() {
  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!vin.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await lookupVin(vin.trim());
      setResult(data);
    } catch (err) {
      setError('Something went wrong reaching the catalog server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFill(sampleVin) {
    setVin(sampleVin);
  }

  function handleViewParts(targetVehicleId) {
    const vid = targetVehicleId || result?.vehicleId;
    if (vid) {
      navigate(`/vehicle/${vid}`);
    }
  }

  return (
    <div style={{ maxWidth: 650, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
          AfricaAutoPart Catalog
        </h1>
        <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>
          Search any 17-digit VIN or East African JDM Chassis Number for confirmed parts & exploded schematics
        </p>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <form onSubmit={handleSearch}>
          <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: 8, fontSize: 14 }}>
            Vehicle Identification (VIN or Chassis / Frame Number)
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="e.g. JTEEB71J10F013008 or KDJ120-0012345"
              maxLength={25}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 16,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Quick Sample Chips */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 13, color: '#64748b' }}>
          <span>Try samples:</span>
          <button
            onClick={() => handleQuickFill('JTEEB71J10F013008')}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}
          >
            Toyota Land Cruiser
          </button>
          <button
            onClick={() => handleQuickFill('MALC281CBLM567587')}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}
          >
            Hyundai Creta
          </button>
          <button
            onClick={() => handleQuickFill('LGWEEUA50SL614287')}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}
          >
            GWM Haval
          </button>
          <button
            onClick={() => handleQuickFill('KDJ120-0012345')}
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}
          >
            JDM Prado 120
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 20, padding: 14, background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: 14 }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {result.matchType === 'Exact' && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                ✓ Exact Vehicle & VIN Match
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: 20, color: '#0f172a' }}>
                {result.make} — {result.modelDescription || result.model}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '8px 0 16px', fontSize: 13, color: '#475569' }}>
                {result.engine && <span>Engine: <strong>{result.engine}</strong></span>}
                {result.transmission && <span>Transmission: <strong>{result.transmission}</strong></span>}
                {result.steering && <span>Steering: <strong>{result.steering}</strong></span>}
                {result.fuelType && <span>Fuel: <strong>{result.fuelType}</strong></span>}
              </div>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>{result.message}</p>
              <button
                onClick={() => handleViewParts()}
                style={{ padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
              >
                Browse Confirmed Parts & Schematics →
              </button>
            </div>
          )}

          {result.matchType === 'PrefixMatch' && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                ~ Close Batch / Trim Match
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: 20, color: '#0f172a' }}>
                {result.make} — {result.modelDescription || result.model}
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>{result.message}</p>
              {result.vehicleId && (
                <button
                  onClick={() => handleViewParts()}
                  style={{ padding: '10px 20px', background: '#d97706', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                >
                  View Likely Compatible Parts →
                </button>
              )}
            </div>
          )}

          {result.matchType === 'JdmFrameMatch' && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                🇯🇵 JDM Frame Code Recognized
              </div>
              <h2 style={{ margin: '0 0 6px', fontSize: 20, color: '#0f172a' }}>
                {result.make} — {result.modelDescription}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, margin: '8px 0 16px', fontSize: 13, color: '#475569' }}>
                {result.engine && <span>Engine: <strong>{result.engine}</strong></span>}
                {result.fuelType && <span>Fuel: <strong>{result.fuelType}</strong></span>}
              </div>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>{result.message}</p>
              {result.vehicleId ? (
                <button
                  onClick={() => handleViewParts()}
                  style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                >
                  View Catalog for this Model →
                </button>
              ) : (
                <p style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>
                  Full OEM EPC part catalog for this JDM frame is scheduled in upcoming data batch.
                </p>
              )}
            </div>
          )}

          {result.matchType === 'MakeOnly' && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                🏭 Manufacturer Identified: {result.make}
              </div>
              <p style={{ color: '#64748b', fontSize: 14, margin: '10px 0 0' }}>{result.message}</p>
            </div>
          )}

          {result.matchType === 'Unrecognized' && (
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                ❓ Vehicle Not Recognized Yet
              </div>
              <p style={{ color: '#64748b', fontSize: 14, margin: '10px 0 0' }}>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}