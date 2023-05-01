import { useRouter } from 'next/router'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import Link from 'next/link'
import styles from '@/styles/Location.module.css'
import { useSession } from 'next-auth/react'
import ReviewForm from '@/components/ReviewForm'

const LocationPage = () => {
  const router = useRouter()
  const { id, name, lat, lon, street, city, state, zip, phone, website } =
    router.query || {}
  const [machines, setMachines] = useState([])
  const [reviews, setReviews] = useState([]) // Add state for reviews
  const mapRef = useRef(null)
  const setMapRef = useCallback((node) => {
    if (node !== null) {
      mapRef.current = node
    }
  }, [])

  useEffect(() => {
    if (id) {
      const fetchMachines = async () => {
        const response = await fetch(`/api/locationMachines?id=${id}`)
        const data = await response.json()
        setMachines(data.machines)
      }
      fetchMachines()
    }
  }, [id])

  useEffect(() => {
    if (lat && lon && mapRef.current) {
      const loadGoogleMapsApi = async () => {
        const loader = new Loader({
          apiKey: 'AIzaSyBLohfUiW1DeqQ5pLPAlyl2wIkLPJZ_828',
          version: 'weekly',
          libraries: ['places'],
        })

        try {
          await loader.load()

          const map = new google.maps.Map(mapRef.current, {
            center: { lat: parseFloat(lat), lng: parseFloat(lon) },
            zoom: 15,
          })

          new google.maps.Marker({
            position: { lat: parseFloat(lat), lng: parseFloat(lon) },
            map,
          })
        } catch (error) {
          console.error('Failed to load Google Maps API:', error)
        }
      }

      loadGoogleMapsApi()
    }
  }, [lat, lon, mapRef])

  useEffect(() => {
    if (name) {
      const fetchReviews = async () => {
        const response = await fetch(`/api/reviews?locationName=${name}`)
        const data = await response.json()
        setReviews(data)
      }
      fetchReviews()
    }
  }, [name])

  return (
    <div className={styles.container}>
      {id && name && lat && lon && street && city && state && zip && (
        <>
          <div className={styles.columns}>
            <article className={styles.leftColumn}>
              <h1>{name}</h1>
              <p>{street}</p>
              <p>
                {city}, {state} {zip}
              </p>
              <p>{phone}</p>
              {website && <Link href={website}>{website}</Link>}
            </article>
            <div className={styles.rightColumn} ref={mapRef}></div>
          </div>
          <h2 className={styles.h2}>Pinball machines at this location:</h2>
          <div className={styles.machinesGrid}>
            {machines.map((machine) => (
              <div key={machine.id} className={styles.card}>
                <h2>{machine.name}</h2>
                {machine.manufacturer && <p>{machine.manufacturer}</p>}
                {machine.year && <p>{machine.year}</p>}
                {machine.ipdb_link && (
                  <Link href={machine.ipdb_link}>IPDB Link</Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <h2 className={styles.h2}>Reviews for {name}:</h2>
      {reviews.length > 0 ? (
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.card}>
              <p>{review.userReview}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews for this location. Be the first to write a review!</p>
      )}
      <ReviewForm />
    </div>
  )
}

export default LocationPage
