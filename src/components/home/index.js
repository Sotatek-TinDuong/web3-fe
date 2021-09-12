import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../header/header";
import { Footer } from "../footer/index";
import { networkName, reloadPageTimeout } from "../../helpers";
import "./index.scss";

import Web3 from "web3";
let web3;

export const Home = (props) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState("");
  const [messageErr, setMessageErr] = useState(null);
  const [requestMetamaskErr, setRequestMetamaskErr] = useState(null);
  const [connectState, setConnectState] = useState(false);
  let [remainingSeconds, setRemainingSeconds] = useState(4);

  const { ethereum } = window;

  const handleConnectWallet = () => {
    if (!account) {
      loadWeb3();
    }
  };

  const loadWeb3 = () => {
    try {
      if (typeof ethereum === "undefined") {
        const msg = (
          <p>
            Not connected to a Web3 Wallet. <br /> Please install and enable
            MetaMask.
          </p>
        );
        setMessageErr(msg);
      } else {
        setConnectState(true);
        countDownConnection();

        web3 = new Web3(ethereum);

        ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => {
            if (accounts.length) {
              // reset state to default
              setConnectState(false);
              setMessageErr(null);
              requestMetamaskErr(null);
              // set data
              setAccount(accounts[0]);
              getETHBalance(accounts[0]);
              getNetwork();
            }
          })
          .catch((err) => {
            const errorMsg = JSON.stringify(err);
            setRequestMetamaskErr(JSON.parse(errorMsg).message);
          });
      }
    } catch (error) {
      if (error) {
        const err = JSON.stringify(error);
        setMessageErr(
          `${JSON.parse(err).message} Or reload page and connection again.`
        );
      }
    }
  };

  const countDownConnection = () => {
    if (connectState && !requestMetamaskErr) {
      if (remainingSeconds > 0) {
        const countDown = setInterval(() => {
          if (remainingSeconds <= 1) {
            clearInterval(countDown);
            setMessageErr("Connect time expired. Please connect again.");
          }
          let remaingTime = (remainingSeconds -= 1);
          setRemainingSeconds(remaingTime);
        }, 1000);
      }
    }
  };

  const getETHBalance = (address) => {
    web3.eth.getBalance(address, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const balance = web3.utils.fromWei(result, "ether");
        setBalance(balance);
      }
    });
  };

  const getNetwork = () => {
    web3.eth.net
      .getId()
      .then((netId) => {
        setNetwork(networkName(netId));
      })
      .catch((err) => {
        console.log("getNetwork", err);
      });
  };

  const accountsChanged = () => {
    if (ethereum) {
      web3 = new Web3(ethereum);

      ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length) {
          setAccount(accounts[0]);
          getETHBalance(accounts[0]);
          getNetwork();
        } else {
          setAccount(null);
        }
      });
    }
  };

  useEffect(() => {
    // countDownConnection();
    accountsChanged();
  });

  return (
    <>
      <Header connectWallet={() => handleConnectWallet()} account={account} />
      <div className="home-page bg-dark">
        <div className="content">
          <div className="container">
            <div className="wrap-content">
              <img src="/images/metamask-fox.png" alt="metamask" />
              {messageErr && (
                <div className="err-message text-center text-orange">
                  {messageErr}
                </div>
              )}
              {requestMetamaskErr && (
                <div className="err-message text-center text-orange">
                  {requestMetamaskErr}
                </div>
              )}

              {connectState && !requestMetamaskErr && (
                <p>{`Connecting... (${remainingSeconds}s)`}</p>
              )}

              {ethereum && account ? (
                <div className="account-info">
                  <p>
                    <span className="label">-ETH Balance:</span>
                    {balance} ETH
                  </p>
                  <p>
                    <span className="label">-Network:</span>
                    {network}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
