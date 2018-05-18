import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import "./RegistrationForm.css";

export default class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userAddress: '',
      userPhoneNo: '',
      isOwner: false,
    }

    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.submitRegisterationForm = this.submitRegisterationForm.bind(this);
  }

  handleChangeInput(event) {
    const value = event.currentTarget.name === "isOwner" ? !this.state.isOwner : event.currentTarget.value;
    this.setState({
      [event.currentTarget.name]: value
    });
  }

  // Tutorial: Step 3
  submitRegisterationForm(e) {
    e.preventDefault();

    const { setLoading } = this.props;

    const { serviceInstance, currentAccount, setIsUser, history } = this.props;
    const { userName, userAddress, userPhoneNo, isOwner } = this.state;

    setLoading(true);

    // using the event emitter
    serviceInstance.methods.createUser(
      userPhoneNo,
      userName,
      userAddress,
      isOwner
    )
    .send({from: currentAccount})
    .then(function(receipt){
      setLoading(false);

      console.log(receipt);

      setIsUser();
      history.push('/');
    });
  }

  render() {
    const { userName, userAddress, userPhoneNo, isOwner } = this.state;

    return (
      <Container>
        <Row>
          <Col xs={{ size: 6, offset: 3 }}>
            <Form className="text-center form-register">
              <FormGroup row>
                <Label for="userName" sm={3}>Your name</Label>
                <Col sm={9}>
                  <Input type="text" name="userName" id="userName" placeholder="e.g Akaisama" value={userName} onChange={(e) => this.handleChangeInput(e)}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userAddress" sm={3}>Address</Label>
                <Col sm={9}>
                  <Input type="text" name="userAddress" id="userAddress" placeholder="e.g 154 Nguyen Thai Binh, Q.1" value={userAddress} onChange={(e) => this.handleChangeInput(e)}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userPhoneNo" sm={3}>Phone no.</Label>
                <Col sm={9}>
                  <Input type="text" name="userPhoneNo" id="userPhoneNo" placeholder="e.g 0909090909" value={userPhoneNo} onChange={(e) => this.handleChangeInput(e)}/>
                </Col>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="isOwner" value={isOwner} onChange={(e) => this.handleChangeInput(e)}/>{' '}
                  Register as Service Owner?
                </Label>
              </FormGroup>
              <Button onClick={this.submitRegisterationForm}>Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}
