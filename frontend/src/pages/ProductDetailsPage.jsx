import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import ProductDetails from "../components/Products/ProducDetails.jsx"
import { useParams, useSearchParams } from "react-router-dom";

import SuggestedProduct from "../components/Products/SuggestedProduct.jsx"
import { useSelector } from "react-redux";
const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }
  }, [allProducts, data, id, allEvents, eventData])
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        data && <SuggestedProduct data={data} />
      }
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
