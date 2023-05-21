import React, { useState } from 'react';
import styles from '@/styles/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Fragment } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axios.get(`/api/searchBar?inputValue=${searchValue}`);
      const locations = response.data.locations;
      setSearchResults(locations);
      setSearchValue('');

      // Navigate to searchLocations page with search results and search value as props
      router.push({
        pathname: '/searchLocations',
        query: { locations: JSON.stringify(locations), searchValue },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
            <Image src="/pinball.svg" alt="logo" width={35} height={35} />
            <h1>Got Pinball</h1>
        </Link>
      </div>
      <button className={styles.hamburger} onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
        &#9776;
      </button>
      <nav>
        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ""}`}>
          <li>
            <Link href="/pinballMachines">Pinball Machines</Link>
          </li>
          <li>
            <Link href="/eventsLinks">Events</Link>
          </li>
          <li>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search Locations"
                value={searchValue}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </li>
          <li>
            <div>
              {session ? (
        <Fragment>
          <span className={styles.navSpan}>Signed in as {session.user.email}</span>
          <button onClick={() => signOut()} className={styles.navButton}>Sign out</button>
        </Fragment>
      ) : (
        <Fragment>
          <span className={styles.navSpan}>You are not signed in </span>
          <button onClick={() => signIn()} className={styles.navButton}>Sign in</button>
        </Fragment>
      )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar




