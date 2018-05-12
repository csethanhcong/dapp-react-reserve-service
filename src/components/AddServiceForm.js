import React, {Component} from 'react';
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

import "./AddServiceForm.css";

export default class AddServiceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceName: '',
      serviceDescription: '',
      servicePrice: '',
      canPayByRESToken: false,
    }

    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.submitAddServiceForm = this.submitAddServiceForm.bind(this);
  }

  handleChangeInput(event) {
    let value;

    if (event.currentTarget.name === "canPayByRESToken") {
      value = !this.state.canPayByRESToken
    } else if (event.currentTarget.name === "servicePrice") {
      value = parseInt(event.currentTarget.value);
    } else {
      value = event.currentTarget.value;
    }

    this.setState({
      [event.currentTarget.name]: value
    });
  }

  async submitAddServiceForm() {
    const { serviceInstance, currentAccount, toggle, fetchServices, setLoading } = this.props;
    const { serviceName, serviceDescription, servicePrice, canPayByRESToken } = this.state;

    setLoading(true);

    // using the event emitter
    const result = await serviceInstance.methods.createService(
      serviceName,
      serviceDescription,
      servicePrice,
      canPayByRESToken
    )
    .send({from: currentAccount});

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

      toggle();
    }
  }

  render() {
    const { serviceName, serviceDescription, servicePrice, canPayByRESToken } = this.state;

    return (
      <Form>
        <FormGroup row>
          <Label for="serviceName" sm={2}>Service name</Label>
          <Col sm={10}>
            <Input type="text" name="serviceName" id="serviceName" placeholder="e.g Karaoke" value={serviceName} onChange={(e) => this.handleChangeInput(e)}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="serviceDescription" sm={2}>Description</Label>
          <Col sm={10}>
            <Input type="text" name="serviceDescription" id="serviceDescription" placeholder="e.g 154 Nguyen Thai Binh, Q.1" value={serviceDescription} onChange={(e) => this.handleChangeInput(e)}/>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="servicePrice" sm={2}>Price (in finney)</Label>
          <Col sm={10}>
            <Input type="number" name="servicePrice" id="servicePrice" placeholder="e.g 1000" value={servicePrice} onChange={(e) => this.handleChangeInput(e)}/>
          </Col>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" name="canPayByRESToken" value={canPayByRESToken} onChange={(e) => this.handleChangeInput(e)}/>{' '}
            Do you accept paid in DSV Token?
          </Label>
        </FormGroup>
        <FormGroup className="text-center btn-submit-form">
          <Button onClick={this.submitAddServiceForm}>Submit</Button>
        </FormGroup>
      </Form>
    )
  }
}
