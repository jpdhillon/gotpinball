import React, { useState } from 'react';
import styles from '@/styles/Search.module.css';
import { useRouter } from 'next/router';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = async () => {
    const response = await fetch(`/api/searchBar?inputValue=${inputValue}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // Do something with the response, e.g., update state, render results, etc.
    const data = await response.json();

  router.push({
      pathname: '/searchLocations',
      query: { input: inputValue, locations: JSON.stringify(data.locations) },
    });
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.searchHeading}>
        Search for places to play pinball!
      </h1>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="enter street address or city"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <h1 className={styles.searchHeading2}>
        Or search with our interactive map!
      </h1>
    </div>
  );
};

export default Search;

