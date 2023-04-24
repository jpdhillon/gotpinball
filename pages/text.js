import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/PinballMachines.module.css'
import Pagination from '@/components/Pagination'

const PinballMachines = () => {
  // (existing code)

  return (
    <>
      <div className={styles.hero}>
        <Img
          src='/pinballRow.jpg'
          alt='Pinball row'
          layout='fill'
          objectFit='cover'
          objectPosition='center'
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
