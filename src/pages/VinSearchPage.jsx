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
    <div style={{ maxWidth: 680, margin: '48px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          AfricaAutoPart Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: 0, lineHeight: 1.5 }}>
          Search any 17-digit VIN or East African JDM Chassis Number for confirmed parts & exploded schematics
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 14,
          padding: 24,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <form onSubmit={handleSearch}>
          <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, fontSize: 14 }}>
            Vehicle Identification (VIN or Chassis / Frame Number)
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="e.g. JTEEB71J10F013008 or KDJ120-0012345"
              maxLength={25}
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 15,
                borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background-color 0.2s, transform 0.1s',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Quick Sample Chips */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 500 }}>Try samples:</span>
          {[
            { label: 'Toyota Land Cruiser', code: 'JTEEB71J10F013008' },
            { label: 'Hyundai Creta', code: 'MALC281CBLM567587' },
            { label: 'GWM Haval', code: 'LGWEEUA50SL614287' },
            { label: 'JDM Prado 120', code: 'KDJ120-0012345' },
          ].map((sample) => (
            <button
              key={sample.code}
              type="button"
              onClick={() => handleQuickFill(sample.code)}
              style={{
                background: 'var(--chip-bg)',
                color: 'var(--chip-text)',
                border: '1px solid var(--chip-border)',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 500,
                transition: 'background-color 0.15s, border-color 0.15s',
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: '14px 18px',
            background: 'var(--error-bg)',
            color: 'var(--error-text)',
            border: '1px solid var(--error-border)',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {result.matchType === 'Exact' && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--success-bg)',
                  color: 'var(--success-text)',
                  border: '1px solid var(--success-border)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                ✓ Exact Vehicle & VIN Match
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, color: 'var(--text-primary)', fontWeight: 700 }}>
                {result.make} — {result.modelDescription || result.model}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '12px 0 16px', fontSize: 13 }}>
                {result.decodedVehicleYear && <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: 600 }}>Vehicle Year: {result.decodedVehicleYear}</span>}
                {result.generationCoverage && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Catalog Coverage: <strong style={{ color: 'var(--text-secondary)' }}>{result.generationCoverage}</strong></span>}
                {result.engine && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Engine: <strong style={{ color: 'var(--text-secondary)' }}>{result.engine}</strong></span>}
                {result.transmission && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Transmission: <strong style={{ color: 'var(--text-secondary)' }}>{result.transmission}</strong></span>}
                {result.steering && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Drive: <strong style={{ color: 'var(--text-secondary)' }}>{result.steering}</strong></span>}
                {result.fuelType && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Fuel: <strong style={{ color: 'var(--text-secondary)' }}>{result.fuelType}</strong></span>}
                {result.regionalSpec && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Spec: <strong style={{ color: 'var(--text-secondary)' }}>{result.regionalSpec}</strong></span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>{result.message}</p>
              <button
                onClick={() => handleViewParts()}
                style={{
                  padding: '11px 22px',
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background-color 0.2s',
                }}
              >
                Browse Confirmed Parts & Schematics →
              </button>
            </div>
          )}

          {result.matchType === 'PrefixMatch' && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                ✓ Confirmed Model Batch Match (WMI+VDS)
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, color: 'var(--text-primary)', fontWeight: 700 }}>
                {result.make} — {result.modelDescription || result.model}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '12px 0 16px', fontSize: 13 }}>
                {result.decodedVehicleYear && <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 600 }}>Vehicle Year: {result.decodedVehicleYear}</span>}
                {result.generationCoverage && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Catalog Coverage: <strong style={{ color: 'var(--text-secondary)' }}>{result.generationCoverage}</strong></span>}
                {result.engine && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Engine: <strong style={{ color: 'var(--text-secondary)' }}>{result.engine}</strong></span>}
                {result.transmission && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Transmission: <strong style={{ color: 'var(--text-secondary)' }}>{result.transmission}</strong></span>}
                {result.steering && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Drive: <strong style={{ color: 'var(--text-secondary)' }}>{result.steering}</strong></span>}
                {result.fuelType && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Fuel: <strong style={{ color: 'var(--text-secondary)' }}>{result.fuelType}</strong></span>}
                {result.regionalSpec && <span style={{ background: 'var(--chip-bg)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>Spec: <strong style={{ color: 'var(--text-secondary)' }}>{result.regionalSpec}</strong></span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>{result.message}</p>
              {result.vehicleId && (
                <button
                  onClick={() => handleViewParts()}
                  style={{
                    padding: '11px 22px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 15,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Browse Compatible Parts & Exploded Schematics →
                </button>
              )}
            </div>
          )}

          {result.matchType === 'JdmFrameMatch' && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--info-bg)',
                  color: 'var(--info-text)',
                  border: '1px solid var(--info-border)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                🇯🇵 JDM Frame Code Recognized
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, color: 'var(--text-primary)', fontWeight: 700 }}>
                {result.make} — {result.modelDescription}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, margin: '10px 0 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                {result.engine && <span>Engine: <strong style={{ color: 'var(--text-secondary)' }}>{result.engine}</strong></span>}
                {result.fuelType && <span>Fuel: <strong style={{ color: 'var(--text-secondary)' }}>{result.fuelType}</strong></span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>{result.message}</p>
              {result.vehicleId ? (
                <button
                  onClick={() => handleViewParts()}
                  style={{
                    padding: '11px 22px',
                    background: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 15,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'background-color 0.2s',
                  }}
                >
                  View Catalog for this Model →
                </button>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  Full OEM EPC part catalog for this JDM frame is scheduled in upcoming data batch.
                </p>
              )}
            </div>
          )}

          {result.matchType === 'MakeOnly' && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--chip-bg)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                🏭 Manufacturer Identified: {result.make}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '10px 0 0', lineHeight: 1.5 }}>{result.message}</p>
            </div>
          )}

          {result.matchType === 'Unrecognized' && (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--error-bg)',
                  color: 'var(--error-text)',
                  border: '1px solid var(--error-border)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                ❓ Vehicle Not Recognized Yet
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '10px 0 0', lineHeight: 1.5 }}>{result.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}