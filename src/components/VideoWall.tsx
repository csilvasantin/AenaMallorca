import { useState, useCallback, useRef, useEffect } from 'react';

interface Ad {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  image?: string;
}

interface CountryAds {
  country: string;
  ads: Ad[];
  banner: { text: string; color: string };
}

// Map mall_ node IDs to their image/video path
const mallNodeImageMap: Record<string, { image: string; video: string; title: string; subtitle: string; color: string }> = {
  mall_playa: { image: 'images/mallorca/playa-palma.jpg', video: 'videos/excursiones/mall_playa.mp4', title: 'Playa de Palma', subtitle: 'Arena blanca 6km', color: '#00bcd4' },
  mall_catedral: { image: 'images/mallorca/catedral-seu.jpg', video: 'videos/excursiones/mall_catedral.mp4', title: 'Catedral La Seu', subtitle: 'Gótico mediterráneo', color: '#8d6e63' },
  mall_bellver: { image: 'images/mallorca/castillo-bellver.jpg', video: 'videos/excursiones/mall_bellver.mp4', title: 'Castillo Bellver', subtitle: 'Fortaleza circular', color: '#795548' },
  mall_soller: { image: 'images/mallorca/tren-soller.jpg', video: 'videos/excursiones/mall_soller.mp4', title: 'Tren de Sóller', subtitle: 'Ruta panorámica 1912', color: '#ff7043' },
  mall_serra: { image: 'images/mallorca/serra-tramuntana.jpg', video: 'videos/excursiones/mall_serra.mp4', title: 'Serra Tramuntana', subtitle: 'UNESCO Patrimonio', color: '#66bb6a' },
  mall_drach: { image: 'images/mallorca/cuevas-drach.jpg', video: 'videos/excursiones/mall_drach.mp4', title: 'Cuevas del Drach', subtitle: 'Lago subterráneo', color: '#7e57c2' },
  mall_valldemossa: { image: 'images/mallorca/valldemossa.jpg', video: 'videos/excursiones/mall_valldemossa.mp4', title: 'Valldemossa', subtitle: 'Pueblo de Chopin', color: '#ff9800' },
  mall_trenc: { image: 'images/mallorca/es-trenc.jpg', video: 'videos/excursiones/mall_trenc.mp4', title: 'Es Trenc', subtitle: 'Playa virgen', color: '#29b6f6' },
  mall_portals: { image: 'images/mallorca/puerto-portals.jpg', video: 'videos/excursiones/mall_portals.mp4', title: 'Puerto Portals', subtitle: 'Marina de lujo', color: '#5c6bc0' },
};

const countryAdsMap: Record<string, CountryAds> = {
  japan: {
    country: 'Japón',
    banner: { text: '🇯🇵 BIENVENIDOS — VUELO NRT→PMI — PUERTA B12 — RECOGIDA EQUIPAJE CINTA 4', color: '#ff6b9d' },
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
    banner: { text: '🇦🇪 BIENVENIDOS — VUELO DXB→PMI — PUERTA A08 — RECOGIDA EQUIPAJE CINTA 7', color: '#ffd740' },
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
    banner: { text: '🇬🇧 BIENVENIDOS — VUELO LHR→PMI — PUERTA C15 — RECOGIDA EQUIPAJE CINTA 2', color: '#7c4dff' },
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
  mallorca: {
    country: 'Mallorca',
    banner: { text: '🇪🇸 BIENVENIDOS A PALMA DE MALLORCA — AEROPUERTO SON SANT JOAN — DISFRUTA DE LA ISLA', color: '#ff8c00' },
    ads: [
      { emoji: '🏖️', title: 'Playa de Palma', subtitle: 'Arena blanca 6km', color: '#00bcd4', image: 'images/mallorca/playa-palma.jpg' },
      { emoji: '⛪', title: 'Catedral La Seu', subtitle: 'Gótico mediterráneo', color: '#8d6e63', image: 'images/mallorca/catedral-seu.jpg' },
      { emoji: '🏰', title: 'Castillo Bellver', subtitle: 'Fortaleza circular', color: '#795548', image: 'images/mallorca/castillo-bellver.jpg' },
      { emoji: '🚂', title: 'Tren de Sóller', subtitle: 'Ruta panorámica 1912', color: '#ff7043', image: 'images/mallorca/tren-soller.jpg' },
      { emoji: '🌊', title: 'Cala Mondragó', subtitle: 'Parque Natural', color: '#26c6da', image: 'images/mallorca/cala-mondrago.jpg' },
      { emoji: '🧀', title: 'Mercat de l\'Olivar', subtitle: 'Gastronomía local', color: '#ffa726', image: 'images/mallorca/mercat-olivar.jpg' },
      { emoji: '⛰️', title: 'Serra Tramuntana', subtitle: 'UNESCO Patrimonio', color: '#66bb6a', image: 'images/mallorca/serra-tramuntana.jpg' },
      { emoji: '🛥️', title: 'Excursión Cabrera', subtitle: 'Isla paradisíaca', color: '#42a5f5', image: 'images/mallorca/isla-cabrera.jpg' },
      { emoji: '🍷', title: 'Bodega Binissalem', subtitle: 'Vinos mallorquines', color: '#e53935', image: 'images/mallorca/bodega-binissalem.jpg' },
      { emoji: '🏊', title: 'Cala Varques', subtitle: 'Cala escondida', color: '#00e5ff', image: 'images/mallorca/cala-varques.jpg' },
      { emoji: '🎨', title: 'Fundación Miró', subtitle: 'Arte en Palma', color: '#ec407a', image: 'images/mallorca/fundacion-miro.jpg' },
      { emoji: '🚴', title: 'Ruta ciclista', subtitle: 'Cap Formentor', color: '#4caf50', image: 'images/mallorca/ciclismo-formentor.jpg' },
      { emoji: '🦎', title: 'Cuevas del Drach', subtitle: 'Lago subterráneo', color: '#7e57c2', image: 'images/mallorca/cuevas-drach.jpg' },
      { emoji: '🍊', title: 'Valldemossa', subtitle: 'Pueblo de Chopin', color: '#ff9800', image: 'images/mallorca/valldemossa.jpg' },
      { emoji: '⛵', title: 'Puerto Portals', subtitle: 'Marina de lujo', color: '#5c6bc0', image: 'images/mallorca/puerto-portals.jpg' },
      { emoji: '🏝️', title: 'Es Trenc', subtitle: 'Playa virgen', color: '#29b6f6', image: 'images/mallorca/es-trenc.jpg' },
      { emoji: '🎵', title: 'Jazz Voyeur Club', subtitle: 'Noches de Palma', color: '#ab47bc', image: 'images/mallorca/jazz-palma.jpg' },
      { emoji: '🐟', title: 'Lonja de Palma', subtitle: 'Arquitectura gótica', color: '#78909c', image: 'images/mallorca/lonja-palma.jpg' },
    ],
  },
};

function getCountryFromNodeId(nodeId: string): string | null {
  if (nodeId.startsWith('japan')) return 'japan';
  if (nodeId.startsWith('dubai')) return 'dubai';
  if (nodeId.startsWith('london')) return 'london';
  if (nodeId === 'airport') return 'mallorca';
  if (nodeId.startsWith('mall_')) return 'mallorca';
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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  // Sync all video elements to the first one's currentTime
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const master = videoRefs.current.find(v => v && !v.paused);
      if (!master) return;
      videoRefs.current.forEach(v => {
        if (v && v !== master && Math.abs(v.currentTime - master.currentTime) > 0.1) {
          v.currentTime = master.currentTime;
        }
      });
    }, 500);
    return () => clearInterval(syncInterval);
  }, []);

  if (!country) return null;

  const data = countryAdsMap[country];
  if (!data) return null;

  const totalCTS = data.ads.length;
  const count = totalCTS - disabledCTS.size;
  const basePath = import.meta.env.BASE_URL;

  // Check if we're on a specific excursion node (mall_*)
  const selectedExcursion = mallNodeImageMap[currentNodeId] || null;

  return (
    <div className="videowall">
      <div className="videowall-header">
        <h3 className="videowall-title">
          📺 VideoWall — {selectedExcursion ? selectedExcursion.title : data.country}
        </h3>
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
            P2 Mosaico
          </button>
          <button
            className={`preset-btn ${preset === 3 ? 'active' : ''}`}
            onClick={() => setPreset(3)}
          >
            P3 CTS
          </button>
        </div>
      </div>

      {/* Toggle buttons — shared across all presets */}
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

      {/* Grid fija de 18 monitores — siempre 9x2 */}
      <div
        className={`videowall-canvas videowall-cts ${preset === 1 ? 'videowall-off-grid' : preset === 2 ? 'videowall-banner-grid' : ''}`}
        style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}
      >
        {data.ads.map((ad, i) => {
          const isOff = disabledCTS.has(i);
          const ctsLabel = `CTS-${(i + 1).toString().padStart(2, '0')}`;

          // Monitor apagado — igual en todos los presets
          if (isOff) {
            return (
              <div key={i} className="cts-screen cts-screen-off">
                <div className="cts-header cts-header-off">
                  <span className="cts-id" style={{ color: '#444' }}>{ctsLabel}</span>
                  <span className="cts-off-label">OFF</span>
                </div>
                <div className="cts-content cts-content-off">
                  <span className="off-icon">⏻</span>
                </div>
              </div>
            );
          }

          // Preset 1: todos apagados
          if (preset === 1) {
            return (
              <div key={i} className="cts-screen cts-screen-off">
                <div className="cts-header cts-header-off">
                  <span className="cts-id" style={{ color: '#444' }}>{ctsLabel}</span>
                  <span className="cts-off-label">OFF</span>
                </div>
                <div className="cts-content cts-content-off">
                  <span className="off-icon">⏻</span>
                </div>
              </div>
            );
          }

          // Preset 2: if excursion selected → video mosaic; otherwise → banner
          if (preset === 2) {
            if (selectedExcursion) {
              // Video Mosaic mode: each monitor shows a piece of the video
              const col = i % 9;
              const row = Math.floor(i / 9);
              return (
                <div key={i} className="cts-screen cts-screen-mosaic">
                  <div className="cts-header" style={{ background: selectedExcursion.color + '30' }}>
                    <span className="cts-id" style={{ color: selectedExcursion.color }}>{ctsLabel}</span>
                    <span className="cts-live" style={{ color: selectedExcursion.color }}>● LIVE</span>
                  </div>
                  <div className="cts-content cts-content-mosaic">
                    <div className="cts-mosaic-piece" style={{ overflow: 'hidden' }}>
                      <video
                        ref={el => { videoRefs.current[i] = el; }}
                        src={`${basePath}${selectedExcursion.video}`}
                        muted
                        loop
                        autoPlay
                        playsInline
                        style={{
                          width: '900%',
                          height: '200%',
                          objectFit: 'cover',
                          marginLeft: `${-col * 100}%`,
                          marginTop: `${-row * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // Default banner mode
            return (
              <div key={i} className="cts-screen cts-screen-banner">
                <div className="cts-header cts-header-banner">
                  <span className="cts-id" style={{ color: data.banner.color }}>{ctsLabel}</span>
                  <span className="cts-live" style={{ color: data.banner.color }}>● LIVE</span>
                </div>
                <div className="cts-content cts-content-banner">
                  <div className="banner-scroll-mini" style={{ color: data.banner.color }}>
                    <span>{data.banner.text}</span>
                    <span>{data.banner.text}</span>
                  </div>
                </div>
              </div>
            );
          }

          // Preset 3: if excursion selected → all monitors show that video; otherwise → individual CTS
          if (selectedExcursion) {
            return (
              <div
                key={i}
                className="cts-screen cts-screen-image"
                style={{
                  borderColor: selectedExcursion.color + '60',
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="cts-header" style={{ background: selectedExcursion.color + '30' }}>
                  <span className="cts-id" style={{ color: selectedExcursion.color }}>{ctsLabel}</span>
                  <span className="cts-live">● LIVE</span>
                </div>
                <div className="cts-content cts-content-with-image">
                  <video
                    ref={el => { videoRefs.current[i] = el; }}
                    src={`${basePath}${selectedExcursion.video}`}
                    className="cts-image"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                  <div className="cts-image-overlay">
                    <span className="cts-title" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{selectedExcursion.title}</span>
                    <span className="cts-subtitle" style={{ color: '#ddd', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{selectedExcursion.subtitle}</span>
                  </div>
                </div>
              </div>
            );
          }

          // Default P3: individual CTS cards
          const hasImage = !!ad.image;

          return (
            <div
              key={i}
              className={`cts-screen ${hasImage ? 'cts-screen-image' : ''}`}
              style={{
                borderColor: ad.color + '60',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div className="cts-header" style={{ background: ad.color + '30' }}>
                <span className="cts-id" style={{ color: ad.color }}>{ctsLabel}</span>
                <span className="cts-live">● LIVE</span>
              </div>
              {hasImage ? (
                <div className="cts-content cts-content-with-image">
                  <img
                    src={`${basePath}${ad.image}`}
                    alt={ad.title}
                    className="cts-image"
                    loading="lazy"
                  />
                  <div className="cts-image-overlay">
                    <span className="cts-title" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{ad.title}</span>
                    <span className="cts-subtitle" style={{ color: '#ddd', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{ad.subtitle}</span>
                  </div>
                </div>
              ) : (
                <div className="cts-content">
                  <div className="cts-emoji">{ad.emoji}</div>
                  <span className="cts-title" style={{ color: ad.color }}>{ad.title}</span>
                  <span className="cts-subtitle">{ad.subtitle}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
