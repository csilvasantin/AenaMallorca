import { useState, useCallback } from 'react';

interface Ad {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}

interface CountryAds {
  country: string;
  ads: Ad[];
  banner: { text: string; color: string };
}

const countryAdsMap: Record<string, CountryAds> = {
  japan: {
    country: 'Japón',
    banner: { text: '🇯🇵 BIENVENIDOS — VUELO NRT→MAD — PUERTA B12 — RECOGIDA EQUIPAJE CINTA 4', color: '#ff6b9d' },
    ads: [
      { emoji: '🗼', title: 'Visit Tokyo Tower', subtitle: 'Vistas de 360°', color: '#ff6b9d' },
      { emoji: '🍣', title: 'Tsukiji Market', subtitle: 'El mejor sushi del mundo', color: '#ff5252' },
      { emoji: '🚄', title: 'Japan Rail Pass', subtitle: 'Shinkansen ilimitado', color: '#2196f3' },
      { emoji: '🏯', title: 'Kyoto Tours', subtitle: 'Templos milenarios', color: '#4caf50' },
      { emoji: '🎌', title: 'Sakura Season', subtitle: 'Marzo - Abril 2026', color: '#e91e63' },
      { emoji: '♨️', title: 'Onsen Hakone', subtitle: 'Relax total', color: '#ff9800' },
      { emoji: '🎎', title: 'Asakusa Tour', subtitle: 'Senso-ji Temple', color: '#9c27b0' },
      { emoji: '🍜', title: 'Ramen Street', subtitle: 'Tokyo Station', color: '#ff7043' },
      { emoji: '🎮', title: 'Akihabara', subtitle: 'Electric Town', color: '#00bcd4' },
      { emoji: '🗻', title: 'Monte Fuji', subtitle: 'Excursión 1 día', color: '#607d8b' },
      { emoji: '🎋', title: 'Arashiyama', subtitle: 'Bosque de bambú', color: '#66bb6a' },
      { emoji: '🐟', title: 'Toyosu Market', subtitle: 'Subasta de atún', color: '#42a5f5' },
      { emoji: '🏔️', title: 'Hakone', subtitle: 'Aguas termales', color: '#8d6e63' },
      { emoji: '🎵', title: 'Karaoke Box', subtitle: 'Shibuya nights', color: '#ab47bc' },
      { emoji: '🌸', title: 'Ueno Park', subtitle: 'Hanami perfecto', color: '#ec407a' },
      { emoji: '🚃', title: 'Yamanote Line', subtitle: 'Circuito completo', color: '#26a69a' },
      { emoji: '🎪', title: 'Robot Restaurant', subtitle: 'Espectáculo único', color: '#ffa726' },
      { emoji: '🏪', title: 'Konbini Tour', subtitle: '7-Eleven gourmet', color: '#5c6bc0' },
    ],
  },
  dubai: {
    country: 'Dubai',
    banner: { text: '🇦🇪 BIENVENIDOS — VUELO DXB→MAD — PUERTA A08 — RECOGIDA EQUIPAJE CINTA 7', color: '#ffd740' },
    ads: [
      { emoji: '🏗️', title: 'Burj Khalifa', subtitle: '828m de altura', color: '#ffd740' },
      { emoji: '🏜️', title: 'Desert Safari', subtitle: 'Aventura en 4x4', color: '#ff9800' },
      { emoji: '🛍️', title: 'Dubai Mall', subtitle: '1200+ tiendas', color: '#e040fb' },
      { emoji: '🌴', title: 'Palm Jumeirah', subtitle: 'La isla artificial', color: '#00e676' },
      { emoji: '⛵', title: 'Dubai Marina', subtitle: 'Crucero al atardecer', color: '#00bcd4' },
      { emoji: '🎢', title: 'IMG Worlds', subtitle: 'Parque temático indoor', color: '#f44336' },
      { emoji: '🕌', title: 'Grand Mosque', subtitle: 'Abu Dhabi excursión', color: '#78909c' },
      { emoji: '🏊', title: 'Atlantis Aquaventure', subtitle: 'Parque acuático', color: '#29b6f6' },
      { emoji: '🌇', title: 'Dubai Frame', subtitle: 'Mirador dorado', color: '#ffca28' },
      { emoji: '🐪', title: 'Camel Ride', subtitle: 'Al Marmoom', color: '#a1887f' },
      { emoji: '🎿', title: 'Ski Dubai', subtitle: 'Esquí en el desierto', color: '#90caf9' },
      { emoji: '🚤', title: 'Speed Boat', subtitle: 'Tour costa', color: '#4dd0e1' },
      { emoji: '🌃', title: 'Dhow Cruise', subtitle: 'Cena flotante', color: '#7e57c2' },
      { emoji: '🏎️', title: 'Ferrari World', subtitle: 'Abu Dhabi', color: '#e53935' },
      { emoji: '💎', title: 'Gold Souk', subtitle: 'Mercado del oro', color: '#fbc02d' },
      { emoji: '🦅', title: 'Falconry', subtitle: 'Experiencia halcón', color: '#8d6e63' },
      { emoji: '🏖️', title: 'JBR Beach', subtitle: 'Playa urbana', color: '#26c6da' },
      { emoji: '🎭', title: 'La Perle', subtitle: 'Show acuático', color: '#ab47bc' },
    ],
  },
  london: {
    country: 'Londres',
    banner: { text: '🇬🇧 BIENVENIDOS — VUELO LHR→MAD — PUERTA C15 — RECOGIDA EQUIPAJE CINTA 2', color: '#7c4dff' },
    ads: [
      { emoji: '🎡', title: 'London Eye', subtitle: 'Vista panorámica', color: '#7c4dff' },
      { emoji: '👑', title: 'Buckingham Palace', subtitle: 'Cambio de guardia', color: '#ffd740' },
      { emoji: '🏰', title: 'Tower of London', subtitle: '1000 años de historia', color: '#795548' },
      { emoji: '☕', title: 'Afternoon Tea', subtitle: 'Tradición británica', color: '#ffab40' },
      { emoji: '🎭', title: 'West End Shows', subtitle: 'Musicales de clase mundial', color: '#e91e63' },
      { emoji: '🚇', title: 'Oyster Card', subtitle: 'Viaja por todo Londres', color: '#2196f3' },
      { emoji: '🏛️', title: 'British Museum', subtitle: 'Entrada gratuita', color: '#78909c' },
      { emoji: '🌉', title: 'Tower Bridge', subtitle: 'Icono de Londres', color: '#42a5f5' },
      { emoji: '🎨', title: 'Tate Modern', subtitle: 'Arte contemporáneo', color: '#ec407a' },
      { emoji: '📸', title: 'Big Ben', subtitle: 'Westminster', color: '#8d6e63' },
      { emoji: '🛒', title: 'Camden Market', subtitle: 'Mercado alternativo', color: '#66bb6a' },
      { emoji: '⚽', title: 'Wembley Stadium', subtitle: 'Tour guiado', color: '#ef5350' },
      { emoji: '🌳', title: 'Hyde Park', subtitle: 'Pulmón de Londres', color: '#4caf50' },
      { emoji: '🎸', title: 'Abbey Road', subtitle: 'Paso de Beatles', color: '#ff7043' },
      { emoji: '🍺', title: 'Traditional Pub', subtitle: 'Fish & Chips', color: '#ffa726' },
      { emoji: '🎪', title: 'Madame Tussauds', subtitle: 'Figuras de cera', color: '#ab47bc' },
      { emoji: '📚', title: 'Harry Potter Tour', subtitle: 'Estudios Warner', color: '#5c6bc0' },
      { emoji: '🚌', title: 'Double Decker', subtitle: 'Tour en bus rojo', color: '#e53935' },
    ],
  },
};

function getCountryFromNodeId(nodeId: string): string | null {
  if (nodeId.startsWith('japan')) return 'japan';
  if (nodeId.startsWith('dubai')) return 'dubai';
  if (nodeId.startsWith('london')) return 'london';
  return null;
}

type Preset = 1 | 2 | 3;

interface VideoWallProps {
  currentNodeId: string;
}

export function VideoWall({ currentNodeId }: VideoWallProps) {
  const country = getCountryFromNodeId(currentNodeId);
  const [preset, setPreset] = useState<Preset>(3);
  const [disabledCTS, setDisabledCTS] = useState<Set<number>>(new Set());

  const toggleCTS = useCallback((index: number) => {
    setDisabledCTS(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  if (!country) return null;

  const data = countryAdsMap[country];
  if (!data) return null;

  const activeCTS = data.ads.filter((_, i) => !disabledCTS.has(i));
  const totalCTS = data.ads.length;

  // Calculate optimal grid based on active screens
  const count = activeCTS.length;
  let cols: number;
  if (count <= 2) cols = count;
  else if (count <= 4) cols = 2;
  else if (count <= 9) cols = 3;
  else if (count <= 16) cols = 4;
  else cols = 6;

  return (
    <div className="videowall">
      <div className="videowall-header">
        <h3 className="videowall-title">📺 VideoWall — {data.country}</h3>
        <div className="preset-buttons">
          <button
            className={`preset-btn ${preset === 1 ? 'active' : ''}`}
            onClick={() => setPreset(1)}
          >
            P1 Off
          </button>
          <button
            className={`preset-btn ${preset === 2 ? 'active' : ''}`}
            onClick={() => setPreset(2)}
          >
            P2 Banner
          </button>
          <button
            className={`preset-btn ${preset === 3 ? 'active' : ''}`}
            onClick={() => setPreset(3)}
          >
            P3 CTS
          </button>
        </div>
      </div>

      {/* Preset 1: Lienzo apagado */}
      {preset === 1 && (
        <div className="videowall-canvas videowall-off">
          <span className="off-label">LIENZO APAGADO</span>
        </div>
      )}

      {/* Preset 2: Banner a pantalla completa */}
      {preset === 2 && (
        <div className="videowall-canvas videowall-banner">
          <div className="banner-scroll" style={{ color: data.banner.color }}>
            <span>{data.banner.text}</span>
            <span>{data.banner.text}</span>
          </div>
        </div>
      )}

      {/* Preset 3: 18 CTS adaptativas */}
      {preset === 3 && (
        <>
          <div className="cts-status">
            <span className="cts-count">
              CTS activas: {count}/{totalCTS}
            </span>
            <div className="cts-toggles">
              {data.ads.map((_, i) => (
                <button
                  key={i}
                  className={`cts-toggle ${disabledCTS.has(i) ? 'off' : 'on'}`}
                  onClick={() => toggleCTS(i)}
                  title={`CTS-${(i + 1).toString().padStart(2, '0')}`}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
          <div
            className="videowall-canvas videowall-cts"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {activeCTS.map((ad, i) => (
              <div
                key={ad.title}
                className="cts-screen"
                style={{
                  borderColor: ad.color + '60',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="cts-header" style={{ background: ad.color + '30' }}>
                  <span className="cts-id" style={{ color: ad.color }}>
                    CTS-{(data.ads.indexOf(ad) + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="cts-live">● LIVE</span>
                </div>
                <div className="cts-content">
                  <div className="cts-emoji">{ad.emoji}</div>
                  <span className="cts-title" style={{ color: ad.color }}>{ad.title}</span>
                  <span className="cts-subtitle">{ad.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
