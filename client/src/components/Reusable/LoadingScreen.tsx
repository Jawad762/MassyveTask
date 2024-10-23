import React from "react";
import Spinner from "./Spinner";

const LoadingScreen = () => {
  return (
    <section className='h-full grid place-items-center z-30 bg-black'>
      <Spinner/>
    </section>
  );
};

export default LoadingScreen;
