# Basic Flow of Decentralized Identity (DID)
A basic flow with 3 parties (issuer, holder, and verifier) using Hyperledger Aries JS to create, transfer, and verify a credentials.

## Getting Started
In this demo all three **Issuer**, **Holder**, and **Verifier** are in a [Node.js](https://nodejs.org) environment.

To work with Aries Framework JavaScript we need to install several dependencies and follow different steps. This [guide](https://aries.js.org/guides/getting-started/installation/nodejs) will get you setup for Node.js environment. 

We need these dependencies installed on our system to work with AFJ
- NodeJS
- yarn
- libsodium
- libzmq
- indy-sdk.

Once you're done with above steps you need to follow below steps: -
1. clone this repository
2. Rename .env.example file to .env (As this is a demo, the demo credentials are publically disclosed)
3. Install project dependencies using `yarn`

```
yarn install
```
- Install `ts-node` globally for JIT (Just in Time) compilation of TypeScript files, if you've not installed globally yet. 

```
yarn global add ts-node
```
- The `src/index.ts` is the entry point to the application. To change the flow of application, you can edit `src/index.ts` and finally run

```
ts-node src/index.ts
```







