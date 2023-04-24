import React from 'react';
import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/pinball.svg" alt="logo" width={35} height={35} />
        <h1>Got Pinball</h1>
      </div>
      <nav>
        <ul className={styles.navLinks}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/pinballMachines">Pinball Machines</a>
          </li>
          <li>
            <a href="/eventsLinks">Events/Links</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
