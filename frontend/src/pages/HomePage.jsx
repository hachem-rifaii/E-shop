import React from 'react'
import Header from '../components/layouts/Header'
import Hero from '../components/Route/Hero/Hero'
import Categories from '../components/Route/Categories/Categories'
import BestDeals from '../components/Route/BestDeals/BestDeals'
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct'
import Events from '../components/Route/Events/Events'
import Sponsored from '../components/Route/Sponsored/Sponsored.jsx'
import Footer from '../components/layouts/Footer'
const HomePage = () => {
    return (
        <div>
            <Header activeHeanding={1} />
            <Hero />
            <Categories />
            <BestDeals />
            <Events />
            <FeaturedProduct />
            <Sponsored />
            <Footer />
        </div>
    )
}

export default HomePage