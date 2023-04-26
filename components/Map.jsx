import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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
    const map = new google.maps.Map(mapRef.current, {
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

        google.maps.event.addListener(infoWindow, 'domready', () => {
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

  const loadGoogleMapsApi = async () => {
    const loader = new Loader({
      apiKey: 'AIzaSyBLohfUiW1DeqQ5pLPAlyl2wIkLPJZ_828',
      version: 'weekly',
      libraries: ['places'],
    });

    try {
      await loader.load();
      initMap();
    } catch (error) {
      console.error('Failed to load Google Maps API:', error);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (regions.length > 0) {
      loadGoogleMapsApi();
    }
  }, [regions]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    ></div>
  );
};

export default Map;











