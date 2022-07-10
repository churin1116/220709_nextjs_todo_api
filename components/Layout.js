import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Layout({ children, title = 'Default title' }) {
    return (
        <div className='flex flex-col justify-center items-center min-h-screen text-white font-mono bg-gray-800'>
            <Head>
                <title>{title}</title>
            </Head>
            <main className='flex flex-1 flex-col justify-center items-center w-screen'>
                {children}
            </main>
            <footer className='w-full h-6 flex justify-center items-center text-gray-500 text-sm'>
                ©2022 Ryotaro Nakabayashi
            </footer>
        </div>
    );
}