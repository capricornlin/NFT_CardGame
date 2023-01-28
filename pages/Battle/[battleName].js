import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { astral, attackSound, defenseSound } from '../../public/assets';
// import { playAudio } from '../../utils/animation';

import {
  Alert,
  ActiveButton,
  Card,
  GameInfo,
  PlayerInfo,
} from '../../components';
import { useGlobalContext } from '../../context';
import {
  attack,
  defense,
  player01 as player01Icon,
  player02 as player02Icon,
} from '../../public/assets';

const battle = () => {
  const {
    contract,
    gameData,
    currentAccount,
    showAlert,
    setshowAlert,
    battleGround,
    setBattleGround,
    setErrorMessage,
    player1Ref,
    player2Ref,
  } = useGlobalContext();
  const router = useRouter();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = router.query;
  // >console.log
  // console.log({ battleGround });
  // console.log({ battleName });
  console.log({ gameData });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) {
        router.push('/');
      }
    }, [2000]);
    return () => clearTimeout(timer);
  }, [gameData]);

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;
        // console.log(gameData.activeBattle.players[0]);
        if (
          gameData.activeBattle.players[0]?.toLowerCase() ===
          currentAccount?.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
          console.log({ player01Address });
          console.log({ player02Address });
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
          console.log({ player01Address });
          console.log({ player02Address });
        }
        // console.log('hi', { gameData });
        const p1TokenData = await contract.getPlayerToken(player01Address);
        const player01 = await contract.getPlayer(player01Address);
        // console.log({ player01Address });
        // console.log('this is player1', { player01 });
        const player02 = await contract.getPlayer(player02Address);
        // console.log({ player02Address });
        // console.log('this is player2', { player02 });
        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        // console.log({ p1H });
        const p1M = player01.playerMana.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();

        setPlayer1({
          ...player01,
          att: p1Att,
          def: p1Def,
          health: p1H,
          mana: p1M,
        });
        setPlayer2({
          ...player02,
          att: 'X',
          def: 'X',
          health: p2H,
          mana: p2M,
        });
      } catch (error) {
        // console.log({ error });
        setErrorMessage(error);
      }
    };
    if (contract && gameData.activeBattle) getPlayerInfo();
  }, [contract, gameData, battleName, currentAccount]);

  const makeAMove = async (choice) => {
    // playAudio(choice === 1 ? attackSound : defenseSound);
    try {
      //NOTE:之所以有時候會失敗gaslimit不夠，所以我們可以在這邊傳入gaslimit
      await contract.attackOrDefendChoice(choice, battleName, {
        gasLimit: 200000,
      });
      setshowAlert({
        status: true,
        type: 'info',
        message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`,
      });
    } catch (error) {
      // console.log({ error });
      setErrorMessage(error);
    }
  };

  return (
    //${battleGround}

    <div className={`flexBetween gameContainer bg-astral`}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />
      <div className="flexCenter flex-col my-10">
        <Card
          card={player2}
          title={player2?.playerName}
          cardRef={player2Ref}
          playerTwo
        />
        <div className="flex items-center flex-row">
          <ActiveButton
            imgUrl={attack}
            handleClick={() => makeAMove(1)}
            restStyles="mr-2 hover:border-yellow-500"
          />
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-3"
          />
          <ActiveButton
            imgUrl={defense}
            handleClick={() => makeAMove(2)}
            restStyles="ml-6 hover:border-red-600"
          />
        </div>
      </div>
      <PlayerInfo player={player1} playerIcon={player01Icon} />
      <GameInfo />
    </div>
  );
};

export default battle;
