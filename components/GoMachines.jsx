import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/GoMachines.module.css';

const GoMachines = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textBar}>
        <Link href="/pinballMachines" className={styles.textLink}>
            View over 1,400 pinball machines!
            <img src="/binoculors.svg" alt="search" className={styles.searchIcon} />
        </Link>
      </div>
    </div>
  );
};

export default GoMachines;
