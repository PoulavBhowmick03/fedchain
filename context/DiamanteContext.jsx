"use client"

import { Horizon, Keypair, NotFoundError, TransactionBuilder, BASE_FEE, Networks, Operation, Asset, Memo } from "diamante-sdk-js";
import { useState, useEffect, useContext, createContext } from "react";

const DiamanteContext = createContext()
const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS  
const storeSecret = process.env.NEXT_PUBLIC_STORE_SECRET

export const useDiamante = () => useContext(DiamanteContext)

export function DiamanteProvider({children}) {
    const [server, setServer] = useState(null)
    const [publicAdd, setPublicAdd] = useState(null)
    const [secret, setSecret] = useState(null)
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        async function initializeDiamante() {
            const res = new Horizon.Server("https://diamtestnet.diamcircle.io")
            setServer(res)
        }
        initializeDiamante()
    }, [])

    // useEffect(() => {
    //     console.log(secret, publicAdd)
    //     console.log('use effect')
    // }, [secret, publicAdd])

    async function createAddress() {
        if (server) {
            const pair = Keypair.random()
        setPublicAdd(pair.publicKey())
        setSecret(pair.secret())
        // console.log(secret, publicAdd)
        try {
            const response = await fetch(
              `https://friendbot.diamcircle.io?addr=${encodeURIComponent(
                pair.publicKey()
              )}`
            );
            const responseJSON = await response.json();
            console.log("SUCCESS! You have a new account :)\n", responseJSON);
          } catch (e) {
            console.error("ERROR!", e);
          }
          try {
            var parentAccount = await server.loadAccount(pair.publicKey());
            var childAccount = Keypair.random();
            var createAccountTx = new TransactionBuilder(parentAccount, {
              fee: BASE_FEE,
              networkPassphrase: Networks.TESTNET,
            });
            createAccountTx = await createAccountTx
              .addOperation(
                Operation.createAccount({
                  destination: childAccount.publicKey(),
                  startingBalance: "5",
                })
              )
              .setTimeout(180)
              .build();
            await createAccountTx.sign(pair);
            let txResponse = await server
              .submitTransaction(createAccountTx)
              .catch(function (error) {
                console.log("there was an error");
                console.log(error.response);
                console.log(error.status);
                console.log(error.extras);
                return error;
              });
            // console.log(txResponse);
            // console.log("Created the new account", childAccount.publicKey());
      
            const account = await server.loadAccount(pair.publicKey());
            setBalance(account.balances[0].balance)
          } catch (e) {
            console.error("ERROR!", e);
          }
        } else {
            return
        }

    }

    async function storeDiam() {
        if (server && secret) {
            var sourceKeys = Keypair.fromSecret(
                secret
            );
            var transaction;
            server.loadAccount(storeAddress).catch(function(error) {
                if (error instanceof NotFoundError) {
                    throw new Error("The destination account does not exist!");
                  } else return error;
            }).then(function () {
                return server.loadAccount(sourceKeys.publicKey())
            }).then(function(sourceAccount) {
                transaction = new TransactionBuilder(sourceAccount, {
                    fee: BASE_FEE,
                    networkPassphrase: Networks.TESTNET,
                  })
                    .addOperation(
                      Operation.payment({
                        destination: storeAddress,
                        asset: Asset.native(),
                        amount: "10",
                      })
                    )
                    .addMemo(Memo.text("Test Transaction"))
                    .setTimeout(180)
                    .build();
                    transaction.sign(sourceKeys)
                    return server.submitTransaction(transaction)
            }).then(function(result) {
                console.log('success')
            }).catch(function(e) {
                console.error(e)
            })

        }
    }

    async function giveDiam() {
        if (server && storeSecret) {
            var sourceKeys = Keypair.fromSecret(
                storeSecret
            );
            var transaction;
            server.loadAccount(publicAdd).catch(function(error) {
                if (error instanceof NotFoundError) {
                    throw new Error("The destination account does not exist!");
                  } else return error;
            }).then(function () {
                return server.loadAccount(sourceKeys.publicKey())
            }).then(function(sourceAccount) {
                transaction = new TransactionBuilder(sourceAccount, {
                    fee: BASE_FEE,
                    networkPassphrase: Networks.TESTNET,
                  })
                    .addOperation(
                      Operation.payment({
                        destination: publicAdd,
                        asset: Asset.native(),
                        amount: "10",
                      })
                    )
                    .addMemo(Memo.text("Test Transaction"))
                    .setTimeout(180)
                    .build();
                    transaction.sign(sourceKeys)
                    return server.submitTransaction(transaction)
            }).then(function(result) {
                console.log('success')
            }).catch(function(e) {
                console.error(e)
            })
        }
    }

    async function storeBalance() {
        if (server) {
            const acc = await server.loadAccount(storeAddress)
            return acc.balances[0].balance

        }
    }

    return (
        <DiamanteContext.Provider value={{server, createAddress, storeDiam, giveDiam, storeBalance, balance, publicAdd, secret}}>
            {children}
        </DiamanteContext.Provider>
    )
}