import React, {Component} from 'react'
import {
  Layout,
  Row,
  Col,
  Button,
  Menu,
  Breadcrumb,
  Divider,
  List,
  Card,
  Avatar,
  Icon
} from 'antd';
import Chance from 'chance';
const {Header, Footer, Sider, Content} = Layout;

import MarketplaceABI from '../build/contracts/Marketplace.json'
import * as contract from 'truffle-contract'
import getWeb3 from './utils/getWeb3'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      marketplaceInstance: null,
      players: [],
    }

    this.MarketplaceInstance = null;

    this.instantiateContract = this.instantiateContract.bind(this);
    this.createNewPlayer = this.createNewPlayer.bind(this);
  }

  componentDidMount() {
    // this.MarketplaceContract.deployed().then(function(instance) {
    // }).then(function(result) {
    //    result is an object with the following values:
    //
    //    result.tx      => transaction hash, string
    //    result.logs    => array of decoded events that were triggered within this transaction
    //    result.receipt => transaction receipt object, which includes gas used
    //
    //    We can loop through result.logs to see if we triggered the Transfer event.
    //   for (var i = 0; i < result.logs.length; i++) {
    //     var log = result.logs[i];
    //
    //     if (log.event === "NewPlayerCreated") {
    //       console.log('> Event');
    //       console.log(log);
    //        We found the event!
    //       break;
    //     }
    //   }
    // }).catch(function(err) {
    //    There was an error! Handle it.
    // });
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      console.log('> Result from getWeb3');
      console.log(results);
      this.setState({
        web3: results.web3
      }, () => {
        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })

    }).catch((error) => {
      console.log('> Error finding web3.');
      console.error(error);
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const self = this;

    self.MarketplaceContract = self.state.web3.eth.contract([
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          }, {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "playerToOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          }, {
            "name": "_to",
            "type": "address"
          }, {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "playerToApprovedOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "string"
          }
        ],
        "name": "createRandomPlayer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "name": "owner",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "count",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_playerId",
            "type": "uint256"
          }, {
            "name": "_price",
            "type": "uint256"
          }
        ],
        "name": "sellPlayer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_playerId",
            "type": "uint256"
          }
        ],
        "name": "buyPlayer",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          }, {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          }, {
            "name": "_to",
            "type": "address"
          }, {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferPlayer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "ownerToPlayerCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "players",
        "outputs": [
          {
            "name": "name",
            "type": "string"
          }, {
            "name": "pass",
            "type": "uint8"
          }, {
            "name": "shoot",
            "type": "uint8"
          }, {
            "name": "defense",
            "type": "uint8"
          }, {
            "name": "uniqueId",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }, {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "playerId",
            "type": "uint256"
          }, {
            "indexed": false,
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "PlayerToSell",
        "type": "event"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "playerId",
            "type": "uint256"
          }
        ],
        "name": "PlayerSold",
        "type": "event"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "playerId",
            "type": "uint256"
          }, {
            "indexed": false,
            "name": "name",
            "type": "string"
          }, {
            "indexed": false,
            "name": "pass",
            "type": "uint8"
          }, {
            "indexed": false,
            "name": "shoot",
            "type": "uint8"
          }, {
            "indexed": false,
            "name": "defense",
            "type": "uint8"
          }, {
            "indexed": false,
            "name": "uniqueId",
            "type": "uint256"
          }
        ],
        "name": "NewPlayerCreated",
        "type": "event"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "from",
            "type": "address"
          }, {
            "indexed": false,
            "name": "to",
            "type": "address"
          }, {
            "indexed": false,
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      }, {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "owner",
            "type": "address"
          }, {
            "indexed": false,
            "name": "approved",
            "type": "address"
          }, {
            "indexed": false,
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      }
    ]);
    // self.MarketplaceContract.setProvider(self.state.web3.currentProvider);

    // This address was created by truffle migrate deploy to Ganache
    // self.MarketplaceInstance = self.MarketplaceContract.at('0x30753e4a8aad7f8597332e813735def5dd395028');

    // Or use from Remix
    self.MarketplaceInstance = self.MarketplaceContract.at('0x8cdaf0cd259887258bc13a92c0a6da92698644c0');

    self.setState({
      currentAccount: self.state.web3.eth.accounts[0],
      marketplaceInstance: self.MarketplaceInstance
    }, () => {
      self.addEventListener();
    });

    // self.state.web3.eth.getAccounts(function(error, accounts) {
    //   if (error) {
    //     return console.error(error);
    //   }
    //
    //   self.MarketplaceContract.deployed()
    //     .then(instance => {
    //       console.log('> Got instance');
    //       console.log(instance);
    //       self.setState({
    //         currentAccount: accounts[0],
    //         marketplaceInstance: instance
    //       });
    //     })
    //     .catch(err => {
    //       console.error('> Got error creating instance from ABI');
    //       console.log(err);
    //     })
    // });
  }

  addEventListener = () => {
    console.log('> Add event listener');
    const self = this;
    const {currentAccount, marketplaceInstance} = self.state;

    marketplaceInstance.events.NewPlayerCreated({
      filter: { from: currentAccount },
      fromBlock: 0
    }, function(error, event){ console.log(event); })
    .on('data', function(event){
      console.log('> Got event data');
      console.log(event); // same results as the optional callback above
    })
    .on('changed', function(event){
      console.log('> Got event changed');
      console.log(event);
      // remove event from local database
    })
    .on('error', console.error);

    // NewPlayerCreated.watch(function(error, response) {
    //   if (error) {
    //     console.error(error);
    //   }
    //
    //   console.log('> Response from event');
    //   console.log(response);
    //
    //   const newPlayerCreated = {
    //     playerId: response.args.playerId.c[0],
    //     name: response.args.name,
    //     pass: response.args.pass.c[0],
    //     defense: response.args.defense.c[0],
    //     shoot: response.args.shoot.c[0],
    //     uniqueId: response.args.uniqueId.c[0],
    //   };
    //
    //   console.log('> newPlayerCreated');
    //   console.log(newPlayerCreated);

      // self.setState({
      //   players: [...self.state.players, newPlayerCreated],
      // });
    // });
  }

  createNewPlayer = () => {
    const randomName = (new Chance()).name();
    const {marketplaceInstance, currentAccount} = this.state;

    marketplaceInstance.createRandomPlayer(randomName, {
      from: currentAccount,
      gas: 210000,
    }, (error, result) => {
      if (error) {
        console.log('> Error: ', error);
      } else {
        console.log('> Result from createNewPlayer');
        console.log(result);
      }
    });

    marketplaceInstance.methods.myMethod(123).send({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
    .on('transactionHash', function(hash){
    })
    .on('confirmation', function(confirmationNumber, receipt){
    })
    .on('receipt', function(receipt){
        // receipt example
        console.log(receipt);

    })
    .on('error', console.error); // If there's an out of gas error the second parameter is the receipt.

  }

  render() {

    // const {players} = this.state;

    return (<Layout>

      <Header style={{
          position: 'fixed',
          width: '100%'
        }}>
        <div className="logo"/>
      </Header>

      <Content style={{
          padding: '50px 0',
          marginTop: 64
        }}>

        <div style={{
            background: '#fff',
            padding: 24
          }}>
          <Row>

            <Col span={16}>
              <h1>Your account: Address goes here</h1>
              {/* <List style={{
                  paddingRight: '50px',
                  borderRight: 'solid 1px'
                }} dataSource={players} renderItem={player => (<List.Item key={player.playerId}>
                  <List.Item.Meta avatar={<Avatar src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} title={<a href = "https://ant.design" > {
                      player.name
                    }
                    </a>}/>
                  <div>Pass: {player.pass} | Shoot: {player.shoot} | Defense: {player.defense}</div>
                </List.Item>)}></List> */}

              <Row style={{
                  textAlign: 'center'
                }}>
                <Button icon="plus" size="large" onClick={() => this.createNewPlayer()}>Get new player</Button>
              </Row>
            </Col>

            <Col span={8} style={{
                paddingLeft: '50px'
              }}>
              <h1>Transfer Market</h1>
              {/* <List dataSource={data} renderItem={player => (<List.Item key={player.title}>
                  <List.Item.Meta avatar={<Avatar src = "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} title={<a href = "https://ant.design" > {
                      player.title
                    }
                    </a>}/>
                  <div>Content</div>
                </List.Item>)}></List> */}
            </Col>

          </Row>
        </div>

      </Content>

      <Footer style={{
          textAlign: 'center'
        }}>
        DApp ©2018 Created by CongPT
      </Footer>

    </Layout>);
  }
}

export default App
