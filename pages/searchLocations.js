import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/SearchLocations.module.css'
import { Loader } from '@googlemaps/js-api-loader'

const SearchLocations = () => {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [locations, setLocations] = useState([])
  const [map, setMap] = useState(null)
  const [apiLoaded, setApiLoaded] = useState(false)

  const handleMarkerClick = useCallback(
    (location) => {
      router.push({
        pathname: '/location',
        query: { ...location },
      })
    },
    [router]
  )

  const initMap = useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !window.google ||
      locations.length === 0
    ) {
      return
    }

    if (window.google && locations.length > 0) {
      const mapOptions = {
        center: {
          lat: parseFloat(locations[0].lat),
          lng: parseFloat(locations[0].lon),
        },
        zoom: 10,
      }

      const newMap = new window.google.maps.Map(
        document.getElementById('map'),
        mapOptions
      )

      locations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
          },
          map: newMap,
          title: location.name,
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div id="info-window-content-${location.id}"><a href="#">${location.name}</a></div>`,
        })

        marker.addListener('click', () => {
          infoWindow.open(newMap, marker)

          // Add a listener for the link in the info window
          window.google.maps.event.addListener(infoWindow, 'domready', () => {
            document
              .getElementById(`info-window-content-${location.id}`)
              .addEventListener('click', (e) => {
                e.preventDefault()
                handleMarkerClick(location)
              })
          })
        })
      })

      setMap(newMap)
    }
  }, [locations, handleMarkerClick])

  useEffect(() => {
    if (router.isReady) {
      const { input, locations } = router.query
      setInput(input)
      setLocations(JSON.parse(locations))

      const loadGoogleMapsApi = async () => {
        const loader = new Loader({
          apiKey: 'AIzaSyBLohfUiW1DeqQ5pLPAlyl2wIkLPJZ_828',
          version: 'weekly',
          libraries: ['places'],
        })

        try {
          await loader.load()
          setApiLoaded(true)
        } catch (error) {
          console.error('Failed to load Google Maps API:', error)
        }
      }

      loadGoogleMapsApi()
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    if (locations.length > 0 && apiLoaded) {
      initMap()
    }
  }, [locations, apiLoaded, initMap])

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1>Locations closest to {input}:</h1>
        {locations.map((location) => (
          <div key={location.id} className={styles.card}>
            {/* Update the title to be a clickable link */}
            <h2>
              <Link href={{ pathname: '/location', query: { ...location } }}>
                {location.name}
              </Link>
            </h2>
            <p>
              {location.street}, {location.city}, {location.state}{' '}
              {location.zip}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.rightColumn}>
        <div id='map' className={styles.map}></div>
      </div>
    </div>
  )
}

export default SearchLocations
