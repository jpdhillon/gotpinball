import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/FindMachines.module.css'

const FindMachines = () => {
  const router = useRouter()
  const { id, name } = router.query
  const [locations, setLocations] = useState([])

  useEffect(() => {
    if (id) {
      const fetchLocations = async () => {
        const response = await fetch(`/api/machineFind?id=${id}`)
        const data = await response.json()
        setLocations(data.locations)
      }

      fetchLocations()
    }
  }, [id])

  return (
    <div className={styles.container}>
      {locations.length > 0 ? (
        <>
          <h1>{name} is available at the following locations:</h1>
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
        </>
      ) : (
        <h1>{name} is not available at any locations.</h1>
      )}
    </div>
  )
}

export default FindMachines
