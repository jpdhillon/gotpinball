import React from 'react';
import styles from '@/styles/Footer.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.text}>Data powered by </span>
      <div className={styles.imageWrapper}>
        <Link href="https://pinballmap.com/"> {/* Add the Link component */}
            <Image
              src='/pinballmap.png'
              alt='Pinball Map'
              width={350} // Set the initial width
              height={50} // Set the initial height
              className={styles.responsiveImage} // Add the className for responsiveness
            />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;





