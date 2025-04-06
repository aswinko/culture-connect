import Navbar from '@/components/layout/Navbar'
import React from 'react'
import Profile from './ProfileClient'
import Footer from '@/components/layout/Footer'

const page = () => {
  return (
    <>
      <Navbar />
      <Profile />
      <Footer />
    </>
  )
}

export default page
