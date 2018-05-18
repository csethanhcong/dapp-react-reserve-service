import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom'
import { Container, Row, Col, Button, Media, Badge } from 'reactstrap';
import ReactLoading from "react-loading";
import { ToastContainer, toast } from 'react-toastify';

import './ServiceList.css';

export default class ServiceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTransactionHash: '',
    }
  }

  componentDidMount() {

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

  // Tutorial: Step 6
  reserveServiceByETH = async (serviceId) => {
    const { serviceInstance, currentAccount, services, fetchServices, web3, setLoading } = this.props;

    const service = services[serviceId];

    setLoading(true);

    const result = await serviceInstance.methods.reserveServiceByETH(serviceId)
    .send({
      from: currentAccount,
      gas: 210000,
      value: web3.utils.toWei(service.price, 'finney'),
    });


    if (result) {
      console.log(result);
      toast.info(`🦄 Hooray! Here\'s your TX: ${result.transactionHash}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      });

      await fetchServices(true);

      setLoading(false);

    } else {
      console.log('> Error with reserveServiceByETH');
    }
  }

  // Tutorial: Step 7
  reserveServiceByRESToken = async (serviceId) => {
    const { serviceInstance, currentAccount, services, fetchServices, web3, setLoading } = this.props;

    const service = services[serviceId];

    setLoading(true);

    const result = await serviceInstance.methods.reserveServiceByRESToken(serviceId)
    .send({
      from: currentAccount,
      gas: 210000,
    });

    if (result) {
      console.log(result);
      toast.info(`🦄 Hooray! Here\'s your tx: ${result.transactionHash}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 60,
      });

      await fetchServices(true);

      setLoading(false);

    } else {
      console.log('> Error with reserveServiceByRESToken');
    }
  }

  render() {
    const { serviceInstance, currentAccount, services } = this.props;

    return (
        <Row>
          {services.map((service, key) =>
            <Col xs={12} key={key}>
              <Media className="media-service-item">
                <Media className="service-placeholder ribbon-container">
                  <a href="javascript:void(0);" className="media-heading ribbon">#{key+1}</a>
                </Media>
                <Media body className="media-text">
                  <p>Owner: {service.owner}</p>
                  <p>Service: {service.name}</p>
                  <p>Description: {service.description}</p>
                  <p>Price: {service.price} finney (or DSV Token <img className="icon-eth-balance" src={process.env.PUBLIC_URL + '/dsv-icon.svg'}/>)</p>
                  <p>
                    {
                      service.canPayByDSVToken ?
                        <Badge color="success">Accept to pay in RESToken</Badge>:
                        <Badge color="danger">Sorry, we don't accept to pay in RESToken</Badge>
                    }
                  </p>
                  <div>
                    {
                      service.isReserved ?
                        <p> <Badge color="secondary">Reserved</Badge> </p>
                        :
                        <div>
                          <p>
                            Status: <Badge color="primary">Available</Badge>
                          </p>
                          <Row className="btn-group-service non-padding">
                            <Col className="non-padding" xs={4}>
                              <Button color="info" onClick={() => this.reserveServiceByETH(key)}>Get it with ETH</Button>
                            </Col>
                            {
                              service.canPayByDSVToken &&
                              <Col className="non-padding" xs={{size: 4, offset: 1}}>
                                <Button color="info" onClick={() => this.reserveServiceByRESToken(key)}>Get it with DSV Token</Button>
                              </Col>
                            }
                          </Row>
                        </div>
                    }
                  </div>
                </Media>
              </Media>
            </Col>
          )}
        </Row>
    );
  }
}
