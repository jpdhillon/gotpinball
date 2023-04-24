import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '@/styles/Layout.module.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <div className={styles.layout}>
      <Navbar className={styles.navbar} />
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        onLoad={() => {
          window.isGoogleMapsApiLoaded = true
        }}
      />
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}
