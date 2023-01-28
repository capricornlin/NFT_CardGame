import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { player01, player02 } from '../public/assets';

const GameLoad = () => {
  const router = useRouter();
  const { currentAccount } = useGlobalContext();

  return (
    <div className="flexBetween gameLoadContainer ">
      <div className="gameLoadBtnBox">
        <CustomButton
          title="Choose Battleground"
          handleClick={() => router.push('/battleground')}
          restStypes="mt-6"
        />
      </div>
      <div className="flex-1 flexCenter flex-col">
        <h1 className="headText text-center">
          Waiting for a <br /> worthy opponent...
        </h1>
        <p className="gameLoadText">
          Protip: while you are waiting, choose your preferred battleground
        </p>
        <div className="gameLoadPlayersBox">
          <div className="flexCenter flex-col">
            <Image
              src={player01}
              alt="player_img"
              className="gameLoadPlayerImg"
            />
            <p className="gameLoadPlayerText">{currentAccount.slice(0, 30)}</p>
          </div>
          <h2 className="gameLoadVS">Vs</h2>
          <div className="flexCenter flex-col">
            <Image
              src={player02}
              alt="player_img"
              className="gameLoadPlayerImg"
            />
            <p className="gameLoadPlayerText">Waiting...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoad;
