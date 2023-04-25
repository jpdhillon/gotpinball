import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '@/styles/RegionLocations.module.css'

const RegionLocations = () => {
  const router = useRouter()
  const [region, setRegion] = useState({})
  const [locations, setLocations] = useState([])

  const fetchLocations = async (regionName) => {
    const response = await fetch(`/api/regionSearch?name=${regionName}`)
    const data = await response.json()
    setLocations(data.locations)
  }

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
          lat: parseFloat(region.lat),
          lng: parseFloat(region.lon),
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
    }
  }, [locations, handleMarkerClick, region.lat, region.lon])

  const { lat, lon, name } = router.query

  useEffect(() => {
    if (router.isReady) {
      setRegion({ lat, lon, name })
      fetchLocations(name)
    }
  }, [router.isReady, lat, lon, name])

  const handleMarkerClick = (location) => {
    router.push({
      pathname: '/location',
      query: { ...location },
    })
  }

  useEffect(() => {
    if (
      locations.length > 0 &&
      typeof window !== 'undefined' &&
      window.isGoogleMapsApiLoaded
    ) {
      initMap()
    }
  }, [locations, initMap])

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1>Locations in {region.name}:</h1>
        {locations.map((location) => (
          <div key={location.id} className={styles.card}>
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

export default RegionLocations
