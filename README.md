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

## Basic Flow
> Note: Split the terminal into two side by side. 

Currently, the default credential is issued everytime, which is as follows: 
```typescript
credential_attributes:[
  {name: 'name', value: 'Jane Doe'},
  {name: 'age', value: '23'},
]
```
#### Issuing Credentials: Generate + Transfer Credentials
- Use left terminal for issuing the credentials

```bash
yarn issue
```

##### Output - Issued Credentials
<img src="https://github.com/sadityakumar9211/hyperledger-selection-task-demo/assets/78147198/777723cf-64eb-40ff-8326-7680dd647435" width="650" height="650"/>

#### Verifying Credentials
- Use right terminal for verifying the credentials
```bash
yarn verify
```

> Currently, issuing and verification of credentials is done all with one command and is done in [this](https://github.com/sadityakumar9211/hyperledger-selection-task-demo/tree/all-in-one) branch. 

```bash
yarn issue
```

##### Output - Verifying Credentials: When issuer is the verifier
<img src="https://github.com/sadityakumar9211/hyperledger-selection-task-demo/assets/78147198/21f0f8c3-f15c-4142-9219-9a588a54a81a" width="650" height="550"/>
