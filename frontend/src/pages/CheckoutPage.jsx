import React from 'react'
import Header from '../components/layouts/Header.jsx'
import CheckoutSteps from '../components/Checkout/CheckoutSteps.jsx'
import Checkout from '../components/Checkout/Checkout.jsx'
import Footer from '../components/layouts/Footer.jsx'

const CheckoutPage = () => {
  return (
    <div>
        <Header />
        <br />
        <br />
        <CheckoutSteps active={1}/>
        <Checkout />
        <br />
        <br />
        <Footer />
    </div>
  )
}

export default CheckoutPage