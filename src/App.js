import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom'
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import ReactLoading from "react-loading";
import { ToastContainer, toast } from 'react-toastify';

import { UnauthorizedRoute, AuthorizedRoute } from './components/Routes';
import RegistrationForm from './components/RegistrationForm';
import Main from './components/Main';

import ServiceContractABI from '../build/contracts/ServiceFactory.json'
import * as contract from 'truffle-contract'
import getWeb3 from './utils/getWeb3'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';


const Loading = () => {
  return <ReactLoading type="cylon" color="#fff" />
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      serviceInstance: null,
      currentAccount: null,

      loading: false,
      isUser: false,

      services: [],
    }

    this.serviceInstance = null;

    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {

    const { currentAccount } = this.state;
    const self = this;

    // Interval to fetch new account from Metamask
    self.accountInterval = setInterval(function() {
      self.state.web3.eth.getAccounts((error, accounts) => {
        console.log(`> Fetch new account from Metamask: ${accounts[0]}`);
        if (accounts[0] !== currentAccount) {
          self.setState({
            currentAccount: accounts[0],
          })
        }
      });
    }, 1000);

    // this.ServiceContract.deployed().then(function(instance) {
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

  componentWillUnMount() {
    clearInterval(this.accountInterval);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    const self = this;

    this.setLoading(true);

    getWeb3.then(results => {
      console.log('> Result from getWeb3');
      console.log(results);
      self.setState({
        web3: results.web3
      }, () => {
        // Instantiate contract once web3 provided.
        self.instantiateContract();
      })

    }).catch((error) => {
      console.log('> Error finding web3.');
      console.error(error);
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.serviceInstance !== prevState.serviceInstance ||
      this.state.currentAccount !== prevState.currentAccount
    ) {
      if (this.isUserExisted()) {
        console.log('Update component - Set isUser && force fetchServices');
        this.setIsUser();
        this.fetchServices(true);
      }
    }
  }

  setIsUser = () => {
    this.setState({
      isUser: true
    })
  }

  setLoading = (loading) => {
    console.log(`> Someone call setLoading: ${loading}`);
    this.setState({
      loading,
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

    // This address was created by truffle migrate deploy to Ganache
    // We can load contract from this Truffle deployed address to Remix
    // self.serviceInstance = new self.state.web3.eth.Contract(ServiceContractABI.abi, '0x345ca3e014aaf5dca488057592ee47305d9b3e10');

    // From Ropsten Testnet
    self.serviceInstance = new self.state.web3.eth.Contract(ServiceContractABI.abi, '0xa51d2752819112ec6151623ea515233234524dfa');
    // this.serviceInstance = this.ServiceContract.at('0x30753e4a8aad7f8597332e813735def5dd395028');

    // Or use from Remix, that's also deploy to Ganache via Web3 Provider as our local node
    // this.serviceInstance = this.ServiceContract.at('0x8cdaf0cd259887258bc13a92c0a6da92698644c0');
    self.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      console.log(self.serviceInstance);
      self.setState({
        currentAccount: accounts[0],
        serviceInstance: self.serviceInstance,
        loading: false,
      });
    });
  }

  isUserExisted = () => {
    const self = this;

    const { serviceInstance, currentAccount } = this.state;
    const { history } = this.props;

    serviceInstance.methods.isUser()
    .call({from: currentAccount})
    .then(function(isUser){
      console.log(`> isUser from isUserExisted ${isUser}`);
      if (isUser) {
        self.setIsUser();
        history.push('/');
      } else {
        history.push('/register');
      }
    });
  }

  fetchServices = async (force = false) => {

    const self = this;

    const { serviceInstance} = this.state;

    let results = this.state.services;
    // Test fetching all users, services from Blockchain
    if (force) {
      results = [];
    }
    const serviceLength = await serviceInstance.methods.getServicesLength().call();

    let promises = [];

    for (let index = 0; index < serviceLength; index++) {
      promises.push(
        serviceInstance.methods.getServiceAtIndex(index).call()
      );
    }

    results = await Promise.all(promises);

    console.log('> Services fetched from Blockchain');
    console.log(results);

    self.setState({
      services: results
    })
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="app-wrapper">
        <Switch>
          <AuthorizedRoute exact path="/" component={Main} {...this.state} fetchServices={this.fetchServices} setLoading={this.setLoading}/>
          <UnauthorizedRoute component={RegistrationForm} {...this.state} setIsUser={this.setIsUser} setLoading={this.setLoading}/>
        </Switch>

        {
          loading && (
            <div className="loading-wrapper">
              <div className="loading-content">
                <ReactLoading type="cylon" color="#fff" className="loading-indicator"/>
                <h3>Waiting for transaction...</h3>
              </div>
            </div>
          )
        }

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
          draggablePercent={60}
        />
      </div>
    )
  }
}

export default withRouter(App);
