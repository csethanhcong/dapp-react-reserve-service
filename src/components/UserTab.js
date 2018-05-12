import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom'
import { Container, Row, Col, Button, Media } from 'reactstrap';
import ReactLoading from "react-loading";
import * as FontAwesome from 'react-icons/lib/fa';

import './UserTab.css';

export default class UserTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserInfo: null,
      currentUserBalanceInETH: 0,
      currentUserBalanceInRESToken: 0,
    }
  }

  async componentWillMount() {
    await this.getCurrentUserInfo();
    await this.getBalanceInETH();
    await this.getBalanceInRESToken();

    // Metamask currently doesn't support Web3 1.0 yet :(
    // serviceInstance.events.allEvents({
    // }, function(error, event) {
    //   console.log('error');
    //   console.log(error);
    //   console.log('event');
    //   console.log(event);
    // })
    // .on('data', function(event){
    //   console.log('> Got event data');
    //   console.log(event); // same results as the optional callback above
    // })
    // .on('changed', function(event){
    //   console.log('> Got event changed');
    //   console.log(event);
    //   // remove event from local database
    // })
    // .on('error', console.error);
  }

  async componentWillReceiveProps(prevProps, nextProps) {
    if (prevProps.currentAccount !== nextProps.currentAccount) {
      await this.refreshBalance();
      await this.getCurrentUserInfo();
    }
  }

  getCurrentUserInfo = async () => {
    const { serviceInstance, currentAccount, services } = this.props;

    const currentUserInfo = await serviceInstance.methods.getCurrentUserInfo().call({
      from: currentAccount
    });
    this.setState({
      currentUserInfo,
    })
  }

  getBalanceInETH = async () => {
    const { web3, currentAccount } = this.props;

    const balanceInETH = await web3.eth.getBalance(currentAccount);
    const currentUserBalanceInETH = web3.utils.fromWei(balanceInETH);

    this.setState({
      currentUserBalanceInETH,
    });
  }

  getBalanceInRESToken = async () => {
    const { serviceInstance, currentAccount, services } = this.props;

    const currentUserBalanceInRESToken = await serviceInstance.methods.balanceOf(currentAccount).call();
    this.setState({
      currentUserBalanceInRESToken,
    })
  }

  refreshBalance = async () => {
    await this.getBalanceInETH();
    await this.getBalanceInRESToken();
  }

  render() {
    const { serviceInstance, currentAccount, services, toggle } = this.props;
    const { currentUserInfo, currentUserBalanceInETH, currentUserBalanceInRESToken } = this.state;

    return (
        <Row className="row-usertab">
          <div className="btn-reload">
            <Button color="link" onClick={this.refreshBalance}><FontAwesome.FaRefresh size={30}/>Refresh</Button>
          </div>
          <div>
            <p>Your address: {currentAccount}</p>
            <p>Your ETH balance: {currentUserBalanceInETH} <img className="icon-eth-balance" src={process.env.PUBLIC_URL + '/eth-icon.png'}/></p>
            <p>Your DSV Token balance: {currentUserBalanceInRESToken} <img className="icon-eth-balance" src={process.env.PUBLIC_URL + '/dsv-icon.svg'}/></p>
            {
              currentUserInfo && currentUserInfo.isOwner ?
                (
                  <div>
                    <p>Role: Service Owner</p>
                    <p className="text-center">
                      <Button color="primary" onClick={toggle}>Add new service</Button>{' '}
                    </p>
                  </div>
                ) :
                (
                  <div>
                    <p>Role: Guest</p>
                    <p className="text-center">
                      <Button color="default" disabled onClick={toggle}>Add new service</Button>{' '}
                    </p>
                  </div>
                )
            }
          </div>
        </Row>
    );
  }
}
