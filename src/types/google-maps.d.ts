declare global {
  interface Window {
    maplibregl: {
      Map: new (options: maplibregl.MapOptions) => maplibregl.Map;
      Marker: new (options?: maplibregl.MarkerOptions) => maplibregl.Marker;
      Popup: new (options?: maplibregl.PopupOptions) => maplibregl.Popup;
      NavigationControl: new (options?: maplibregl.NavigationControlOptions) => maplibregl.NavigationControl;
    };
  }
}

declare namespace maplibregl {
  interface MapOptions {
    container: HTMLElement;
    style: string;
    center: [number, number];
    zoom: number;
    attributionControl?: boolean;
  }

  interface MarkerOptions {
    element?: HTMLElement;
  }

  interface PopupOptions {
    offset?: number;
  }

  interface NavigationControlOptions {
    showCompass?: boolean;
    showZoom?: boolean;
    visualizePitch?: boolean;
  }

  class Map {
    constructor(options: MapOptions);
    addControl(control: NavigationControl): void;
    setCenter(center: [number, number]): void;
    setZoom(zoom: number): void;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setLngLat(lngLat: [number, number]): Marker;
    setPopup(popup: Popup): Marker;
    addTo(map: Map): Marker;
  }

  class Popup {
    constructor(options?: PopupOptions);
    setHTML(html: string): Popup;
  }

  class NavigationControl {
    constructor(options?: NavigationControlOptions);
  }
}

export {};
