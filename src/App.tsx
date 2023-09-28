import React from 'react';
import { useState } from 'react';
import { TatumSDK, Network, Polygon } from '@tatumio/tatum';
import toast, {Toaster} from 'react-hot-toast';
import './App.css';

import { WalletConnectExtension } from 'walletconnect-extension'

if (!process.env.REACT_APP_WC_PROJECT_ID)
    throw new Error("`REACT_APP_WC_PROJECT_ID` env variable is missing.");

const PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID;
const NETWORK = Network.POLYGON_MUMBAI;
type TATUM_TYPE = Polygon;

function SignButton({setAddress, tatum, setTatum, setResult}:
                        {setAddress: any, tatum: any, setTatum: any, setResult: any}) {

    // walletConnect initialization options
    const wcInitOpts =
    {
        projectId: PROJECT_ID,
        // optional parameters
        // relayUrl: '<YOUR RELAY URL>',
        metadata: {
            name: 'Test Tatum Dapp',
            description: 'Test Tatum Dapp',
            url: '#',
            icons: ['https://walletconnect.com/walletconnect-logo.png']
        }
    }
    async function signIn() {
        try {
            let _tatum: any;

            if (!tatum) {
                _tatum = await TatumSDK.init<TATUM_TYPE>({
                    network: NETWORK,
                    configureWalletProviders: [
                        { type: WalletConnectExtension, config: wcInitOpts } ]

                })
                _tatum.walletProvider.use(WalletConnectExtension).emitter.on('wcSessionDelete',
                    (() => disconnect(setAddress, _tatum, setResult) ));
                setTatum(_tatum);
            } else {
                _tatum = tatum;
            }

            // connect to WalletConnect
            const address = await _tatum.walletProvider.use(WalletConnectExtension).getWallet()
            // update address label
            setAddress(address)
        } catch (e) {
            toast.error((e as Error).message, {
                position: "bottom-left",
            });
            console.log(e);
        }
    }

  return (
      <button onClick={signIn} className="App-button">
        WalletConnect
      </button>
  );
}

async function disconnect(setAddress: any, tatum: any, setResult: any) {
    try {
        if (tatum) {
            // disconnect from WalletConnect client
            await tatum.walletProvider.use(WalletConnectExtension).disconnect();
            // update address label
            setAddress('0')
            setResult('disconnected')
            // show notification
            toast.success('Disconnected successfully', {
                position: "bottom-left",
            });
        }
    } catch (e) {
        toast.error((e as Error).message, {
            position: "bottom-left",
        });
    }
}

function DisconnectButton({setAddress, tatum}: {setAddress: any, tatum: any}) {

  return (
      <button onClick={() => disconnect(setAddress, tatum, undefined)} className="App-button" >
        DisConnect WC
      </button>
  );
}

function SignMessageButton({setResult, tatum, inputMessage}:
                               {setResult: any, tatum: any, inputMessage: string}) {

    async function signMessage() {
        let handler: string = '';
        try {
            if (tatum) {
                const msg: string = inputMessage; //'This is a test message';
                // clear result label
                setResult('')
                // display waiting popup
                handler = toast.loading('Waiting for the User to sign Message in his Wallet....', {
                    position: "bottom-left",
                });
                // signing text message via WalletConnect
                const result = await tatum.walletProvider.use(WalletConnectExtension).signPersonal(msg);
                // display success popup
                toast.success('Signed Message', {position: "bottom-left"})
                // update result label
                setResult(result)
            }
        } catch (e) {
            // update result label
            setResult('Error occurred')
            // display error popup
            toast.error((e as Error).message, {
                position: "bottom-left",
            });
        }  finally {
            if (handler) toast.dismiss(handler);
        }
    }

  return (
      <button onClick={signMessage} className="App-button">
        Sign Message
      </button>
  );
}


function TransferButton({setResult, tatum, inputAddress, inputTokenAmount}:
                            {setResult: any, tatum: any, inputAddress: string, inputTokenAmount: number}) {

    async function transferNative() {
        let handler: string = '';
        try {
            if (tatum) {
                // destination address
                const receiverAddress: string = inputAddress;
                // sending amount
                const amount: string = String(inputTokenAmount);
                // display waiting popup
                handler = toast.loading('Waiting for the User to sign the transaction in his Wallet...', {
                    position: "bottom-left",
                });
                // clear result label
                setResult('')
                // signing Tx & sending native tokens via WalletConnect
                const result = await tatum.walletProvider.use(WalletConnectExtension).transferNative(receiverAddress, amount);
                // update result label
                setResult(result)
                toast.success('Transactions successfully sent', {position: "bottom-left"})
            }
        } catch (e) {
            // update result label
            setResult('Error occurred')
            toast.error((e as Error).message, {
                position: "bottom-left",
            });
        } finally {
            if (handler) toast.dismiss(handler);
        }
    }

  return (
      <button onClick={transferNative} className="App-button">
        Transfer Native
      </button>
  );
}

function TransferErc20Button({setResult, tatum, inputAddress, inputTokenAddress, inputTokenAmount}:
{setResult: any, tatum: any, inputAddress: string, inputTokenAddress: string, inputTokenAmount: number}) {

    async function transferErc20() {
        let handler: string = '';
        try {
            if (tatum) {
                const receiverAddress: string = inputAddress;
                const amount: string = String(inputTokenAmount);
                const tokenAddress: string = inputTokenAddress; // test token on Mumbai
                // display waiting popup
                handler = toast.loading('Waiting for the User to sign the transaction in his Wallet....',
                    { position: "bottom-left" });
                // clear result label
                setResult('')
                // signing Tx & sending ERC20 tokens via WalletConnect
                const result = await tatum.walletProvider.use(WalletConnectExtension).transferErc20(receiverAddress, amount, tokenAddress);
                toast.success('Transactions successfully sent', {position: "bottom-left"})
                // update result label
                setResult(result)
            }
        } catch (e) {
            // update result label
            setResult('Error occurred')
            toast.error((e as Error).message, {
                position: "bottom-left",
            });
        } finally {
            if (handler) toast.dismiss(handler);
        }
    }

  return (
      <button onClick={transferErc20} className="App-button">
        Transfer ERC20
      </button>
  );
}



function ApproveErc20Button({setResult, tatum, inputAddress, inputTokenAddress, inputTokenAmount}:
                                {setResult: any, tatum: any, inputAddress: string, inputTokenAddress: string, inputTokenAmount: number}) {

    async function approveErc20() {
        let handler: string = '';
        try {
            if (tatum) {
                const targetContractAddress: string = inputAddress;
                const amount: string = String(inputTokenAmount);
                const tokenAddress: string = inputTokenAddress;
                // display waiting popup
                handler = toast.loading('Waiting for the User to sign the transaction in his Wallet....',
                    { position: "bottom-left" });
                setResult('')
                // NOTE: approval not possible on POLYGON_MUMBAI network
                // signing & sending Approval transaction for ERC20 tokens via WalletConnect
                const result = await tatum.walletProvider.use(WalletConnectExtension).approveErc20(targetContractAddress, amount, tokenAddress);
                toast.success('Transactions successfully sent', {position: "bottom-left"})
                setResult(result)
            }
        } catch (e) {
            setResult('Error occurred')
            toast.error((e as Error).message, {
                position: "bottom-left",
            });
        } finally {
            if (handler) toast.dismiss(handler);
        }
    }

  return (
      <button onClick={approveErc20} className="App-button">
        Approve ERC20
      </button>
  );
}


function App() {
  const [address, setAddress] = useState('0');
  const [strresult, setResult] = useState('0');
  const [tatum, setTatum] = useState(null);
  const [inputMessage, setInputValue] = useState('This is a test message');
  const [inputAddress, setAddressValue] = useState('0x1EDBddB7E4A6D3d03d9DC98CF2F100c01Df6069A');
  const [inputTokenAddress, setTokenAddressValue] = useState('0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e');
  const [inputTokenAmount, setTokenAmountValue] = useState(0.1);

  return (
    <div className="App">
      <Toaster />
      <header className="App-header">
        <img src="./WalletConnect-Emblem-logo.png" alt="logo" />
      </header>
        <div className="App-body">
          <p>
              {/*Edit <code>src/App.tsx</code> and save to reload.*/}
              <SignButton setAddress={setAddress} tatum={tatum} setTatum={setTatum} setResult={setResult}/>
              <DisconnectButton setAddress={setAddress} tatum={tatum}/>
                <br />
              Connected Address: {address}
              <br /><br />
              <input
                  type="text"
                  value={inputMessage}
                  className="App-input"
                  onChange={(e) => setInputValue(e.target.value)}
              />
              <SignMessageButton setResult={setResult} tatum={tatum} inputMessage={inputMessage}/>
              <br />
              <br />
              Target address :
              <input
                  type="text"
                  value={inputAddress}
                  onChange={(e) => setAddressValue(e.target.value)}
                  className="App-input"
              />
              <br />
              Token address :
              <input
                  type="text"
                  className="App-input"
                  value={inputTokenAddress}
                  onChange={(e) => setTokenAddressValue(e.target.value)}
              /><br />
              Token amount :
              <input
                  type="text"
                  className="App-input"
                  value={inputTokenAmount}
                  onChange={(e) => setTokenAmountValue(parseFloat(e.target.value))}
              />
          </p>
          <p>
              <TransferButton setResult={setResult} tatum={tatum} inputAddress={inputAddress} inputTokenAmount={inputTokenAmount}/>
              <TransferErc20Button setResult={setResult} tatum={tatum} inputAddress={inputAddress} inputTokenAddress={inputTokenAddress} inputTokenAmount={inputTokenAmount}/>
              <ApproveErc20Button setResult={setResult} tatum={tatum} inputAddress={inputAddress} inputTokenAddress={inputTokenAddress} inputTokenAmount={inputTokenAmount}/>
          </p>

          Result: {strresult}
        </div>
    </div>
  );
}

export default App;
