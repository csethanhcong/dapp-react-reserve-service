import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom'
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactLoading from "react-loading";

import AddServiceForm from './AddServiceForm';
import ServiceList from './ServiceList';
import UserTab from './UserTab';

import './Main.css';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

  }

  async componentDidMount() {

    const { fetchServices } = this.props;

    await fetchServices(true);

    // Metamask currently doesn't support Web3 1.0 yet :(
    // console.log('> Add event listener');
    // const {currentAccount, serviceInstance} = this.props;
    //
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

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { serviceInstance, currentAccount, fetchServices, services, web3, setLoading } = this.props;

    return (
      <Container>
        <Row>
          <Col xs="5" className="col-usertab">
            <UserTab {...{serviceInstance, currentAccount, services, web3, toggle: this.toggle}} />
          </Col>
          <Col xs={{ size: 6, offset: 1 }} className="col-servicelist">
            <ServiceList {...{serviceInstance, currentAccount, services, fetchServices, web3, setLoading}} />
          </Col>
          <Col xs="12" className="footer text-right">
            <p>Made by ™️CongPT with ❤️</p>
          </Col>
        </Row>

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Service Information</ModalHeader>
          <ModalBody>
            <AddServiceForm  {...{serviceInstance, currentAccount, fetchServices, setLoading}} toggle={this.toggle} />
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}
