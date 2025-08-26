import Article from "@/components/Article";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";

const index = () => {
  return (
    <>
      <Header />
      <div id="hero-wrap">
        <Article />
      </div>
      <Footer />
    </>
  );
};

export default index;
