# Sample react dApp (TatumSDK + WalletConnect v2)

This is just an example app that work with TatumSDK with integrated WalletConnect: [github](https://github.com/Exzender/tatum_v3_fork/tree/walletconnect) \
It has no any practical usage. And even has no any good interface.

## Base for the project

🔗 TatumSDK - https://github.com/tatumio/tatum-js <br />
🔗 TatumSDK extensions - https://github.com/tatumio/ecosystem-addons <br />
🔗 WalletConnect - https://github.com/WalletConnect 

Usage of **WalletConnect** wallet provider inspired by [MetaMask provider](https://docs.tatum.io/docs/wallet-provider/metamask) and similar to it

## Running locally

Install the app's dependencies:

```bash
npm install
```

Set up your local environment variables by copying the example into your own `.env.local` file:

```bash
cp .env.local.example .env.local
```

Your `.env.local` now contains the following environment variables:

- `REACT_APP_WC_PROJECT_ID` (placeholder) - You can generate your own ProjectId at https://cloud.walletconnect.com

## Working with WalletConnect provider

Only one additional step is required: provider initialization. \
Each add/dApp using WalletConnect should have PROJECT_ID, which can be obtained [here](https://cloud.walletconnect.com/)

Initialization object also could have metadata and other parameters.

```ts
const wcInitOpts = {
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
```
Initialization of Tatum SDK with WalletConnect extension:

```ts
import { TatumSDK, Network } from "@tatumio/tatum"
import { WalletConnectExtension } from "walletconnect-extension" 

const tatum = await TatumSDK.init<Ethereum>({
    network: Network.ETHEREUM,
    configureWalletProviders: [
        {type: WalletConnectExtension, config: wcInitOpts}]

})
```
Now provider can connect:
```ts
const wcAccount: string = await tatum.walletProvider.use(WalletConnectExtension).getWallet()
console.log(wcAccount)
```
To be able to respond to WalletConnect events watch for events from emitter.
Only `wcSessionDelete` event implemented - appears when the user disconnects session from its wallet.
```ts
tatum.walletProvider.use(WalletConnectExtension).emitter.on('wcSessionDelete', (() => console.log('disconnected')))
```

## Available react Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Contacts

[LinkedIn](https://www.linkedin.com/in/aleksandr-s-terekhov/)