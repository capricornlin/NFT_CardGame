import { ethers } from 'ethers';
// import { useRouter } from 'next/router';

import { NFTGameABI } from '../context/constant';
import { sparcle } from '../utils/animation';

const emptyAccount = '0x0000000000000000000000000000000000000000';

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parseLog = new ethers.utils.Interface(NFTGameABI).parseLog(logs);

    cb(parseLog);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

//NOTE: 在contract一但創造時，創造出一個EventListener來監聽各種Event，一但Event發生後就可以最初相對應的動作
//NOTE: 例如showAlert、跳轉頁面等
export const createEventListener = ({
  contract,
  provider,
  currentAccount,
  setShowAlert,
  setUpdataGameData,
  router,
  player1Ref,
  player2Ref,
}) => {
  // const router = useRouter();
  //>filter出一個叫NewPlayer的event
  const NewPlayerEventFilter = contract.filters.NewPlayer();
  //NOTE:理論上上面的eventListener得到的NewPlayer會是最新新增的Player
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('New player created', args);

    if (currentAccount.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player had beed successfully registered',
      });
    }
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('New game token created', args);
    if (currentAccount.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player game token had beed successfully created.',
      });
      router.push('/CreateBattle');
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('New battle started!', args, currentAccount);
    if (
      currentAccount.toLowerCase() === args.player1.toLowerCase() ||
      currentAccount.toLowerCase() === args.player2.toLowerCase()
    ) {
      router.push(`/Battle/${args.battleName}`);
    }

    setUpdataGameData((prev) => prev + 1);
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('Battle Move initiated!', args);
    setShowAlert({
      status: true,
      type: 'success',
      message: 'Battle Move initiated',
    });
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('Rounded ended!', args, currentAccount);

    for (let i = 0; i < args.damagedPlayers.length; i++) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === currentAccount) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== currentAccount) {
          sparcle(getCoords(player2Ref));
        }
      }
    }
    setUpdataGameData((prev) => prev + 1);
  });

  const BattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    //>console.log
    console.log('Battle ended', args, currentAccount);
    if (currentAccount.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'You won!',
      });
    } else if (currentAccount.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'You lost!',
      });

      router.push('/CreateBattle');
    }
    // setUpdataGameData((prev) => prev + 1);
  });
};
