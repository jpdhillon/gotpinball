import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const Map = () => {
  const mapRef = useRef(null);
  const [regions, setRegions] = useState([]);
  const router = useRouter();

  const fetchRegions = async () => {
    const response = await fetch('/api/allLocations');
    const data = await response.json();
    setRegions(data.regions);
  };

  const initMap = useCallback(() => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: parseFloat(regions[37].lat), lng: parseFloat(regions[37].lon) },
      zoom: 4,
    });

    regions.forEach((region) => {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(region.lat), lng: parseFloat(region.lon) },
        map: map,
        title: region.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div id="info-window-content-${region.name}"><a href="#">Locations in ${region.name}</a></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);

        window.google.maps.event.addListener(infoWindow, 'domready', () => {
          document
            .getElementById(`info-window-content-${region.name}`)
            .addEventListener('click', (e) => {
              e.preventDefault();
              router.push({
                pathname: '/regionLocations',
                query: { ...region },
              });
            });
        });
      });
    });
  }, [regions, router]);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (regions.length > 0 && typeof window !== 'undefined' && window.isGoogleMapsApiLoaded) {
      initMap();
    }
  }, [regions, initMap]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    ></div>
  );
};

export default Map;







