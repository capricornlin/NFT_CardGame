import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Alert } from '../components';
import { battlegrounds } from '../public/assets';
import { useGlobalContext } from '../context';
import { local } from 'web3modal';

const Battleground = () => {
  const router = useRouter();
  const { setShowAlert, showAlert, setBattleGround } = useGlobalContext();

  const handleBattleFroundChoice = (ground) => {
    setBattleGround(ground.id);

    localStorage.setItem('battleground', ground.id);

    setShowAlert({
      status: true,
      type: 'info',
      message: `${ground.name} is battle ready!`,
    });

    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <div className="flexCenter battlegroundContainer">
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <h1 className="headText text-center">
        Choose your <span className="text-siteViolet"> Battle </span>Ground
      </h1>
      <div className="flexCenter battleGroundsWrapper">
        {battlegrounds.map((ground) => (
          <div
            key={ground.id}
            className="flexCenter battleGroundCard"
            onClick={() => handleBattleFroundChoice(ground)}
          >
            <Image
              src={ground.image}
              alt="ground"
              className="battleGroundCardImg"
            />
            <div className="info absolute">
              <p className="battleGroundCardText">{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Battleground;
