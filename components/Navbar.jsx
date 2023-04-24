import React from 'react';
import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

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
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/pinballMachines">Pinball Machines</Link>
          </li>
          <li>
            <Link href="/eventsLinks">Events/Links</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
