import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useGlobalContext } from '../context';
import { CustomButton, PageHOC } from '../components';

const JoinBattle = () => {
  const router = useRouter();
  const {
    contract,
    gameData,
    setshowAlert,
    setBattleName,
    battleName,
    currentAccount,
    setErrorMessage,
  } = useGlobalContext();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      router.push(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  const handleClick = async (bName) => {
    setBattleName(bName);
    try {
      await contract.joinBattle(battleName, { gasLimit: 200000 });
      setshowAlert({
        status: true,
        type: 'success',
        message: `Joining ${battleName}`,
      });
    } catch (error) {
      // console.log(error);
      setErrorMessage(error);
    }
  };

  return (
    <>
      <h2 className="joinHeadText">Available Battles: </h2>
      <div className="joinContainer">
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.includes(currentAccount))
            .map((battle, index) => {
              return (
                <div key={battle.name + index} className="flexBetween">
                  <p className="joinBattleTitle">
                    {index + 1}. {battle.name}
                  </p>
                  <CustomButton
                    title="Join"
                    handleClick={() => handleClick(battle.name)}
                  />
                </div>
              );
            })
        ) : (
          <p className="joinLoading"> Reload the page to see new battles</p>
        )}
      </div>
      <p className="infoText" onClick={() => router.push('/CreateBattle')}>
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battles </>
);
