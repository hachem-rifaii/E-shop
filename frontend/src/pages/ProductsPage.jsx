import React, { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import styles from "../style/style";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [data, setData] = useState([]);
  const {allProducts} = useSelector((state)=>state.products);
  useEffect(() => {
    if (categoryData === null) {
      const d =
      allProducts && [...allProducts].sort((a, b) =>   b.sold_out -  a.sold_out);
      setData(d);
    } else {
      const d =
      allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
    window.scrollTo(0, 0);
  }, [categoryData , allProducts]);
  return (
    <div>
      <Header activeHeanding={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        {data && data.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">
            No Product Found!
          </h1>
        ) : null}
      </div>
    </div>
  );
};

export default ProductsPage;
