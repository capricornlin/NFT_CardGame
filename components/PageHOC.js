import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { logo, heroImg } from '../public/assets';
import { useGlobalContext } from '../context';
import { Alert } from './index';

//> HOC => pass the component
//> return a function, that function return component
const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const router = useRouter();
  return (
    <div className="hocContainer">
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <div className="hocContentBox">
        <Image
          src={logo}
          alt="logo"
          className="hocLogo"
          onClick={() => router.push('/')}
        />
        <div className="hocBodyWrapper">
          <div className="flex flex-row w-full">
            <h1 className="flex headText head-text">{title}</h1>
          </div>
          <p className="normalText my-10">{description}</p>
          <Component />
        </div>
        <p className="footerText"> Made by Casey</p>
      </div>
      <div className="flex flex-1">
        <Image
          src={heroImg}
          alt="hero-img"
          className="w-full xl:h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PageHOC;
