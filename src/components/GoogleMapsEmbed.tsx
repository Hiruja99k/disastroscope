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
  width = '100%', 
  height = '1800px', 
  location = '',
  zoom = 14,
  mapType = 'm',
  className = ''
}: GoogleMapsEmbedProps) {
  return (
    <div className={`mapouter ${className}`}>
      <div className="gmap_canvas">
        <iframe 
          className="gmap_iframe" 
          width="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://maps.google.com/maps?width=1800&amp;height=1800&amp;hl=en&amp;q=&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          title="Google Maps"
        />
        <a href="https://embed-googlemap.com">embed-googlemap.com</a>
      </div>
      <style>{`
        .mapouter{position:relative;text-align:right;width:100%;height:1800px;}
        .gmap_canvas {overflow:hidden;background:none!important;width:100%;height:1800px;}
        .gmap_iframe {height:1800px!important;}
      `}</style>
    </div>
  );
}
