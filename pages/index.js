import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Auth from '../components/Auth';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title='Login'>
      <Auth />
    </Layout>
  )
}
