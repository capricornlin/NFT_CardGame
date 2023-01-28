import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { ethers, logger } from 'ethers';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';

import { NFTGameABI, NFTGameAddress } from './constant';
import { Alert } from '../components';
import { createEventListener } from '../components/createEventListener';

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(NFTGameAddress, NFTGameABI, signerOrProvider);

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [battleName, setBattleName] = useState('');
  const [updataGameData, setUpdataGameData] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const player1Ref = useRef();
  const player2Ref = useRef();

  const [battleGround, setBattleGround] = useState('bg-astral');

  useEffect(() => {
    const BattleGroundFromLocalStorage = localStorage.getItem('battleground');
    if (BattleGroundFromLocalStorage) {
      setBattleGround(BattleGroundFromLocalStorage);
    } else {
      localStorage.setItem('battleground', battleGround);
    }
  }, []);

  const router = useRouter();

  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });

  const [showAlert, setShowAlert] = useState({
    status: false,
    type: 'info',
    message: '',
  });

  //>CheckIfWallerIsConnected
  const CheckIfWallerIsConnected = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      //>>log
      console.log('CurrentAccount', accounts[0]);
    } else {
      console.log('No Account Found!');
    }
  };
  //>checkIfAccountChanged
  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed to:', accounts[0]);
        setCurrentAccount(accounts[0]);
      });
      //   return () => {
      //     ethereum.removeListener('accountsChanged');
      //   };
    } catch (error) {
      setErrorMessage(error);
      console.log(error);
    }
  };
  //>ConnectWallet
  const ConnectWallet = async () => {
    if (!window.ethereum) return alert('Please install Metamask');

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  //>setContractAndProvider
  const setSmartContractAndProvider = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newProvider = new ethers.providers.Web3Provider(connection);
    const signer = newProvider.getSigner();
    const newContract = new ethers.Contract(NFTGameAddress, NFTGameABI, signer);

    setProvider(newProvider);
    setContract(newContract);
  };

  useEffect(() => {
    CheckIfWallerIsConnected();
    checkIfAccountChanged();
    //QUES:Provider應該是會跟著不同的account而改變？
    //NOTE:Provider只是用來監聽Metamask在網頁上的變化，所以不會因為account變化而跟著變化
    setSmartContractAndProvider();
  }, []);

  // useEffect(() => {
  //   setSmartContractAndProvider();
  // }, [currentAccount]);

  useEffect(() => {
    if (contract) {
      createEventListener({
        contract,
        provider,
        currentAccount,
        setShowAlert,
        setUpdataGameData,
        router,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //>handle error message
  useEffect(() => {
    if (errorMessage) {
      const parseErrorMessage = errorMessage?.reason
        ?.slice(
          'while processing transaction: reverted with reason string '.length
        )
        ?.slice(0, -1);
      if (parseErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parseErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  //> set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      let activeBattle = null;
      const fetchBattles = await contract.getAllBattles();
      const pendingBattles = fetchBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      fetchBattles.forEach((battle) => {
        if (
          battle.players.find(
            (player) => player.toLowerCase() === currentAccount.toLowerCase()
          )
        ) {
          if (battle.winner.startsWith('0x00')) {
            activeBattle = battle;
          }
        }
      });
      //NOTE:在從contract拿取資料時，第一個會是預設的空值，所以要取從第二個開始
      setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
      //>console.log
      console.log({ fetchBattles });
    };
    if (contract) fetchGameData();
  }, [contract, updataGameData]);

  //> check is player
  //QUES:可以移到index.js裡面，並且直接用contract就好不用重新連
  // const checkIsPlayer = async (playerName) => {
  //   try {
  //     const web3Modal = new Web3Modal();
  //     const connection = await web3Modal.connect();
  //     const provider = new ethers.providers.Web3Provider(connection);
  //     const signer = provider.getSigner();
  //     const contract = fetchContract(signer);
  //     //>log
  //     console.log(contract);
  //     const isPlayer = await contract.isPlayer(currentAccount);
  //     //>log
  //     if (isPlayer) {
  //       console.log('Player is already here');
  //     }
  //     if (!isPlayer) {
  //       await contract.registerPlayer(playerName, playerName);
  //       setShowAlert({
  //         status: true,
  //         type: 'info',
  //         message: `Player ${playerName} is being registered`,
  //       });
  //     }
  //   } catch (err) {
  //     setErrorMessage(err);
  //     // setShowAlert({
  //     //   status: true,
  //     //   type: 'failure',
  //     //   message: 'some error occurred',
  //     // });
  //     // console.log(err);
  //     // alert(err);
  //   }
  // };

  return (
    <GlobalContext.Provider
      value={{
        ConnectWallet,
        currentAccount,
        // checkIsPlayer,
        showAlert,
        setShowAlert,
        contract,
        battleName,
        setBattleName,
        gameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
