import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { alertIcon, gameRules } from '../public/assets';

const GameInfo = () => {
  const router = useRouter();
  const { contract, gameData, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const handleBattleExist = async () => {
    const battleExist = gameData.activeBattle.name;

    try {
      await contract.quitBattle(battleExist, { gasLimit: 200000 });
      setShowAlert({
        status: true,
        type: 'info',
        message: `You're quitting the ${battleName}`,
      });
      // router.push('/');
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <div className="gameInfoIconBox">
        <div
          className="gameInfoIcon flexCenter"
          onClick={() => setToggleSidebar(true)}
        >
          <Image src={alertIcon} alt="info" className="gameInfoIconImg" />
        </div>
      </div>
      <div
        className={`gameInfoSidebar ${
          toggleSidebar ? 'translate-x-0' : 'translate-x-full'
        } glassEffect  backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className="gameInfoSidebarCloseBox">
            <div
              className="flexCenter gameInfoSidebarClose"
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>
          <h3 className="gameInfoHeading">Game Rules:</h3>
          <div className="mt-3">
            {gameRules.map((rule, index) => (
              <p key={`game-rule-index${index}`} className="gameInfoText">
                <span className="font-bold">{index + 1}</span>.{rule}
              </p>
            ))}
          </div>
        </div>
        <div className="flexBetween mt-10 gap-4 w-full">
          <CustomButton
            title="Change Battleground"
            handleClick={() => router.push('/Battleground')}
          />
          <CustomButton title="Exist Battle" handleClick={handleBattleExist} />
        </div>
      </div>
    </>
  );
};

export default GameInfo;
