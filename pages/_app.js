import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '@/styles/Layout.module.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <div className={styles.layout}>
      <Navbar className={styles.navbar} />
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}
