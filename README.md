# Tutorial

### Brief introduction about what sort of things this app would do:

> Simple transfer market for football player teams.

1. Each user is a football team, which has up to 5 players in their team

2. User could generate random player from very first step

3. User could sell player with desired price, or buy from other users

---

### Beginning: This tutorial will be covering

1. Setting up the development environment

2. Creating a Truffle project using a Truffle Box

3. Writing the smart contract

4. Compiling and migrating the smart contract

5. Testing the smart contract

6. Creating a user interface to interact with the smart contract

7. Interacting with the DApp in a browser

---

### Steps:

#### 1. Development environment

- Install [Truffle](~http://truffleframework.com/): Truffle provides development environment, testing framework and asset pipeline for Ethereum developers

  > npm install -g truffle

- Install [Ganache](!http://truffleframework.com/ganache/): Personal blockchain to develop in local

#### 2. Create dApp React with Truffle

- Make directory and moving inside it

  > mkdir dapp-react
  >
  > cd dapp-react

- Unbox existing box built for React (try [more](!http://truffleframework.com/boxes/) boxes for practices)

  > truffle unbox react

- Directory structure:
  - `/config`: Contains **Jest** config as well as **Webpack** for development & testing environment

  - `/contracts`: Contains Smart Contract code (_SCC_), will be discussed later

  - `/migrations`: Contains JS code provided by **Truffle** to migrate and deploy SCC to Ethereum Network

  - `/public`: Public folder for React codebase

  - `/scripts`: Scripts used for developing & testing

  - `/src`: Source code for React

  - `/test`: Tests for SCC

  > Note: Upgrade web3 to version 1.0 since we would need some consistent API further
  > `npm install web3 --save`

#### 3. Writing SCC

- **ERC721.sol**: All required methods and events are declared here since we will use ERC721 as _token standard_ for our app. Imagine its an interface for this standard we will implement further

  ```
  pragma solidity ^0.4.2;

  contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address owner);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId);
    event Approval(address owner, address approved, uint256 tokenId);
  }
  ```

- **PlayerFactory.sol**: **[TODO]**

- **Marketplace.sol**: **[TODO]**

- **Notes**:

  - [_Natspec_](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format) comment format:

    Example:
    ```
    /// @param food
    function sample(uint _food) public {}
    ```

    It will yield error here by compiler (In my case, its Truffle Developer Compiler)
    ```
    `DocstringParsingError: Documented parameter "_food" not found in the
    parameter list of the function.`
    ```

    So make sure you're using it right.

#### 4. Compiling and migrating SCC

- Compile SCC with Truffle Developer Console:

  > truffle compile

  Truffle will build your SCC into folder `/build/contracts` and provides lists of JSON files which are called `ABI` ([`Application Binary Interface`](http://solidity.readthedocs.io/en/develop/abi-spec.html#)).
  ```
  TL;DR: `ABI` is defined as standard way to interact with contracts in
  Ethereum Blockchain, from both inside (contract-to-contract) and outside
  (externally owned account)
  ```

- Migrate SCC:

  Migration in this class means that at first we deploy our SCC to the associated Blockchain to interact with. Next times, its simply replace updated SCC for the current one and make sure we don't deploy same SCC.

  Technically, this phase is replacing our contract's state by newest SCC. Remember that Ethereum Blockchain is still a State Machine that transform from this state to that state.

  Prevent duplicate deployment is done with a Contract called `Migrations.sol` and script in `/migrations/1_initial_migration.js`. We need to update script on file `/migrations/2_deploy_contracts.js`

  ```
  var Marketplace = artifacts.require("./Marketplace.sol");

  module.exports = function(deployer) {
    deployer.deploy(Marketplace);
  };
  ```
  Consider `artifacts.require()` as `require()` in JS.

  Because it needs to deploy your SCC to Blockchain or alter state of your contract during next time you update your SCC so you need a running Blockchain. We're using [Ganache](http://truffleframework.com/ganache/) for this purpose.

  Follow their instructions to run your local Blockchain, get back to terminal and run:

  > truffle migrate

  ```
  Note: You could get error here if missing Truffle config. If any, update
  `truffle.js` file like below:

  module.exports = {
    networks: {
      development: {
        host: "localhost",
        port: 7545,
        network_id: "*" // Match any network id
      }
    }
  };
  ```

  You should see:
  ```
  Using network 'development'.

  Running migration: 1_initial_migration.js
    Deploying Migrations...
    ... 0x9a9397da7a053438a4b2f83b3c5b7f8618dce0d0b94e5f88eba79c50e62fce10
    Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
  Saving successful migration to network...
    ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
  Saving artifacts...
  Running migration: 2_deploy_contracts.js
    Deploying Marketplace...
    ... 0x09d3f45565e313d1d61e075af0027ed529aaa0814cf376f0bab45f4c2afa79b7
    Marketplace: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
  Saving successful migration to network...
    ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
  Saving artifacts...
  ```

  And in your Ganache, navigate to `Blocks`, you could see over first block, there're `Contract Creation` as our SCC has been deployed successfully.

  #### 5. Testing the smart contract **[TODO]**

  #### 6. Creating a user interface to interact with the smart contract  

  > Error: [ethjs-query] while formatting outputs from RPC

  Reset web3 account (`Settings -> Reset Account`)
