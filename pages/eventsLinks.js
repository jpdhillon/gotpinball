// /pages/eventsLinks.js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '@/styles/EventsLinks.module.css'
import PureCSSLoader from '../components/PureCSSLoader'

const EventsLinks = () => {
  const [locations, setLocations] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/allLocations')
      const data = await res.json()
      setLocations(data.regions)
    }
    fetchData()
  }, [])

  const fetchEvents = async (regionName) => {
    const res = await fetch(`/api/events?region=${regionName}`)
    const data = await res.json()
    setEvents(data.events)
  }

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName)
    fetchEvents(regionName)
  }

  return (
    <>
      <PureCSSLoader />
      <div className={styles.container}>
        <img src='/event2.jpg' alt='event' className={styles.img} />
        <div className={styles.heading}>
          <h1>Select region to see events: </h1>
        </div>
        <div className={styles.menuContainer}>
          <div className={styles.menu}>
            <div className='pure-menu pure-menu-scrollable custom-restricted'>
              <ul className='pure-menu-list'>
                {locations.map((location) => (
                  <li
                    key={location.id}
                    className='pure-menu-item'
                    onClick={() => handleRegionClick(location.name)}
                  >
                    <a href='#' className='pure-menu-link'>
                      {location.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <style jsx>{`
              .custom-restricted {
                height: 160px;
                width: 150px;
                border: 1px solid gray;
                border-radius: 4px;
                overflow-y: scroll;
              }
            `}</style>
          </div>
        </div>
        {selectedRegion && (
          <div className={styles.events}>
            <h2>These are events for the {selectedRegion} region:</h2>
            <div className={styles.cards}>
              {events.map((event, index) => (
                <div key={index} className={styles.card}>
                  <h3>Event: {event.name || 'N/A'}</h3>
                  <p className={styles.longLink}>
                    Description: {event.long_desc || 'N/A'}
                  </p>
                  {event.external_link && (
                    <p className={styles.longLink}>
                      External Link:{' '}
                      <a
                        href={event.external_link}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {event.external_link}
                      </a>
                    </p>
                  )}
                  <p>Date: {event.start_date || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EventsLinks
