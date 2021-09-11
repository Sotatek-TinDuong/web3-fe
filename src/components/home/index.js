import React, { useCallback, useEffect, useState, useRef } from "react";
import { Header } from "../header/header";
import { Footer } from "../footer/index";
import "./index.scss";

import Web3 from "web3";
let web3;
const { ethereum } = window;

export const Home = (props) => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState('');
  const [messageErr, setMessageErr] = useState(null);
  const [connectState, setConnectState] = useState(false);
  let [remainingSeconds, setRemainingSeconds] = useState(60);

  const loadWeb3 = useCallback(async () => {
    try {
      if (ethereum) {
        setConnectState(true);
        web3 = new Web3(ethereum);
        await ethereum.enable();

        const addresses = await web3.eth.getAccounts();
        if (addresses.length) {
          setAddressToLocalStorage(addresses[0]);
          setAddress(addresses[0]);
          getETHBalance(addresses[0]);
          getNetwork();
          setConnectState(false);
        }
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }

      if (web3) {
        console.log("web3 =>", web3);
      } else {
        const msg = (
          <p>
            Not connected to a Web3 Wallet. <br /> Please install MetaMask.
          </p>
        );
        setConnectState(false);
        setMessageErr(msg);
      }
    } catch (error) {
      if (error) {
        const err = JSON.stringify(error);
        setMessageErr(
          `${JSON.parse(err).message} Or reload page and connection again.`
        );
      }
    }
  });

  const getETHBalance = (address) => {
    web3 = new Web3(ethereum);
    if (web3) {
      web3.eth.getBalance(address, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          const balance = web3.utils.fromWei(result, "ether");
          setBalance(balance);
        }
      });
    }
  };

  const getNetwork = () => {
    web3 = new Web3(ethereum);
    if (web3) {
      web3.eth.net
        .getId()
        .then((netId) => {
          switch (netId) {
            case 1:
              setNetwork("Mainnet");
              break
            case 3:
              setNetwork("Ropsten");
              break
            case 4:
              setNetwork("Rinkeby");
              break
            case 5:
              setNetwork("Goerli");
              break
            case 42:
              setNetwork("Kovan");
              break
            default:
              break;
          }
        })
        .catch((err) => {
          console.log("getNetwork", err);
        });
    }
  };

  const setAddressToLocalStorage = (address) => {
    localStorage.setItem("currentAddress", address);
  };

  const handleConnectWallet = () => {
    const currentAddress = localStorage.getItem("currentAddress");
    if (!currentAddress) {
      loadWeb3();
    } else if (address && address !== currentAddress) {
      loadWeb3();
    } else {
      setAddress(currentAddress);
      getETHBalance(currentAddress);
      getNetwork(currentAddress);
      return;
    }
  };

  const checkConnection = () => {
    if (connectState) {
      if (remainingSeconds > 0) {
        setInterval(() => {
          let remaingTime = (remainingSeconds -= 1);
          setRemainingSeconds(remaingTime);
        }, 1000);
      } else {
        setMessageErr("Connect time expired. Please connect again.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  useEffect(() => {
    checkConnection();
    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        localStorage.removeItem("currentAddress");
        setAddress(null);
      }
    });
    handleConnectWallet();
  });

  return (
    <>
      <Header connectWallet={() => handleConnectWallet()} address={address} />
      <div className="home-page bg-dark">
        <div className="content">
          <div className="container">
            <div className="wrap-content">
              <img src="/images/metamask-fox.png" alt="metamask" />
              {messageErr ? (
                <div className="err-message text-center text-orange">
                  {messageErr}
                </div>
              ) : null}
              {connectState && remainingSeconds > 0 && (
                <p>{`Connecting... (${remainingSeconds}s)`}</p>
              )}
              <div className="account-info">
                <p>
                  <span className="label">-ETH Balance:</span>{balance} ETH
                </p>
                <p>
                  <span className="label">-Network:</span>
                  {network}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
