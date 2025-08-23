import React from 'react';

interface GoogleMapsEmbedProps {
  width?: string;
  height?: string;
  location?: string;
  zoom?: number;
  mapType?: string;
  className?: string;
}

export default function GoogleMapsEmbed({ 
  width = '600px', 
  height = '400px', 
  location = '',
  zoom = 14,
  mapType = 'm',
  className = ''
}: GoogleMapsEmbedProps) {
  const mapUrl = `https://maps.google.com/maps?width=${width}&height=${height}&hl=en&q=${encodeURIComponent(location)}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className={`mapouter ${className}`} style={{ position: 'relative', textAlign: 'right', width, height }}>
      <div className="gmap_canvas" style={{ overflow: 'hidden', background: 'none!important', width, height }}>
        <iframe 
          className="gmap_iframe" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={mapUrl}
          style={{ width: `${width}!important`, height: `${height}!important` }}
          title="Google Maps"
        />
      </div>
      <a href="https://embed-googlemap.com">google maps embed</a>
    </div>
  );
}
