import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/PinballMachines.module.css'
import Pagination from '@/components/Pagination'
import { useRouter } from 'next/router'

const PinballMachines = () => {
  const [machines, setMachines] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const router = useRouter()

  const handleFindMachine = (id, name) => {
    router.push({
      pathname: '/findMachines',
      query: { id, name },
    })
  }

  useEffect(() => {
    const fetchMachines = async () => {
      const response = await fetch('/api/allMachines')
      const data = await response.json()
      setMachines(data.machines)
    }

    fetchMachines()
  }, [])

  const alphabetMachines = machines.sort((a, b) => a.name.localeCompare(b.name))
  const indexOfLastMachine = currentPage * itemsPerPage
  const indexOfFirstMachine = indexOfLastMachine - itemsPerPage
  const currentMachines = alphabetMachines.slice(
    indexOfFirstMachine,
    indexOfLastMachine
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <div className={styles.hero}>
        <img
          src='/pinballRow.jpg'
          alt='Pinball row'
          layout='fill'
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className={styles.titleBar}>
          <h1>View pinball machines, listed alphabetically</h1>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.grid}>
          {currentMachines.map((machine) => (
            <div key={machine.id} className={styles.card}>
              <h2>{machine.name}</h2>
              {machine.opdb_img && (
                <img
                  src={machine.opdb_img}
                  alt={machine.name}
                  width={150}
                  height={150}
                />
              )}
              {machine.manufacturer && <p>{machine.manufacturer}</p>}
              {machine.year && <p>{machine.year}</p>}
              {machine.ipdb_link && (
                <Link href={machine.ipdb_link}>IPDB Link</Link>
              )}
              <button
                onClick={() => handleFindMachine(machine.id, machine.name)}
              >
                Find this machine
              </button>
            </div>
          ))}
        </div>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={machines.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </>
  )
}

export default PinballMachines
