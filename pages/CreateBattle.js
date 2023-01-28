import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// import styles from '../styles/Home.module.css';

import { PageHOC, CustomButton, CustomInput, GameLoad } from '../components';
import { useGlobalContext } from '../context';

const CreateBattle = () => {
  const router = useRouter();
  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      const path = gameData?.activeBattle?.name;
      router.push('Battle/' + path);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;

    try {
      await contract.createBattle(battleName, { gasLimit: 200000 });
      setWaitBattle(true);
    } catch (err) {
      // console.log({ err });
      setErrorMessage(err);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5 ">
        <CustomInput
          Label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStypes="mt-6"
        />
      </div>
      <p className="infoText" onClick={() => router.push('/JoinBattle')}>
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your own Battle and wait for other palyers to join you</>
);
