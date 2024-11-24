import React from 'react'
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import UserOrderDetails from "../components/UserOrderDetails.jsx"

const OrderDetailsPage = () => {
  return (
    <div>
        <Header />
        <UserOrderDetails />
        <Footer />
    </div>
  )
}

export default OrderDetailsPage