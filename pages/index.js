import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useGlobalContext } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';
import { logger } from 'ethers';

const Home = () => {
  const { currentAccount, contract, gameData } = useGlobalContext();
  const [playName, setPlayName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playExists = await contract.isPlayer(currentAccount);
      const playerTokenExists = await contract.isPlayerToken(currentAccount);

      //>console.log
      console.log({ playExists, playerTokenExists });

      if (playExists && playerTokenExists) {
        router.push('/CreateBattle');
      }
    };
    if (contract) checkForPlayerToken();
  }, [contract]);

  useEffect(() => {
    if (gameData.activeBattle) {
      router.push(`/Battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  const checkIsPlayer = async (playerName) => {
    try {
      const isPlayer = await contract.isPlayer(currentAccount);
      //>log
      if (isPlayer) {
        console.log('Player is already here');
      }
      if (!isPlayer) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000,
        });
        setShowAlert({
          status: true,
          type: 'info',
          message: `Player ${playerName} is being registered`,
        });
      }
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <div className="flex flex-col">
      <CustomInput
        Label="Name"
        placeholder="Enter your player name"
        vlaue={setPlayName}
        handleValueChange={setPlayName}
      />
      <CustomButton
        title="Register"
        handleClick={() => {
          checkIsPlayer(playName);
        }}
        restStypes="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Webb3 NFT Card Game
  </>,
  <>
    Connect your wallet to start player <br /> the ultimate Web3 Battle Card
    Game
  </>
);
