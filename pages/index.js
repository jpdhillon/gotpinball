import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
import Search from '@/components/Search'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import GoMachines from '@/components/GoMachines'
import SignIn from '@/components/SignIn'

const DynamicMap = dynamic(() => import('../components/Map'), { ssr: false })

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.isGoogleMapsApiLoaded = false

      window.initGoogleMaps = function () {
        window.isGoogleMapsApiLoaded = true
      }
    }
  }, [])
  return (
    <>
      <Head>
        <title>Got Pinball</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/pinball.svg' />
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.left}>
            <Search />
            <DynamicMap />
          </div>
          <div className={styles.right}>
            <div className={styles.top}>
              <GoMachines />
            </div>
            <div className={styles.bottom}>
              <SignIn />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
