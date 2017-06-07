import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { BrowserRouter } from 'react-router-dom'
import Validation from 'react-validation';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import { api } from '../../../config';
import { CustomerSaveUi } from './customer.save.component';
import { EmailRegex,DateRegex,NumberRegex,styles } from '../../../utils.const' 
export const history = createBrowserHistory();

export class CustomerSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: {
        "customerID": "",
        "customerName": "",
        "mobile": "",
        "landline": "",
        "customerEmail": "",
        "dateOfBirth": moment(),
        "customerAddress": "",
        "status": true,
        "distributorName": "",
        "distributorAddress": "",
        "distributorContact": "",
      },
      validation: {
        "customerName": "",
        "mobile": "",
        //"landline": "",
        "customerEmail": "",
        "dateOfBirth": "",
        "customerAddress": "",
        //"status": "",
        "distributorName": "",
        "distributorAddress": "",
        "distributorContact": ""
      }
      //   dateOfBirth: moment()

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.save = this.save.bind(this);
    this.validate = this.validate.bind(this);
    this.ifFormValid = this.ifFormValid.bind(this);
  }

  componentWillMount() {
    if (this.props.match.params.employeeID) {
      if (localStorage.getItem('loggedInUserPermission') !== null) {
        var logggedInUserPermission = JSON.parse(localStorage.getItem('loggedInUserPermission'));

        if (logggedInUserPermission.indexOf('OB.U') === -1) {
          window.location.href = '/#/not-authorize'
          return;
        }
      }
    } else {
      if (localStorage.getItem('loggedInUserPermission') !== null) {
        var logggedInUserPermission = JSON.parse(localStorage.getItem('loggedInUserPermission'));

        if (logggedInUserPermission.indexOf('OB.C') === -1) {
          window.location.href = '/#/not-authorize'
          return;
        }
      }

    }
  }
  componentDidMount() {
    if (this.props.match.params.employeeID) {
      axios
        .get(api + `/customers/` + this.props.match.params.employeeID)
        .then(res => {
          const customer = res.data
          this.setState({ customer });
        });
    } else {
      this.setState({ disableSave: true })
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let formData = Object.assign({}, this.state.customer);
    formData[name] = value;
    this.setState({
      customer: formData
    });
  }
  validate(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let validations = Object.assign({}, this.state.validation);
    if (value.trim() == "") {
      validations[name] = "Required";
    } else if (name === "customerEmail") {
      if (EmailRegex.test(value)) {
        validations[name] = "";
      } else {
        validations[name] = "Not a valid email"
      }
    } else if (name === "dateOfBirth") {
      if (DateRegex.test(value)) {
        validations[name] = "";
      } else {
        validations[name] = "Not a valid Date(MM/DD/YYYY)"
      }
    } else if (name === "mobile" || name === "distributorContact") {
      if (NumberRegex.test(value)) {
        validations[name] = "";
      } else {
        validations[name] = "Not a valid contact number"
      }
    } else {
      validations[name] = "";
    }
    this.setState({
      validation: validations
    });
  }
  handleChange(date) {
    let formData = Object.assign({}, this.state.customer);
    formData.dateOfBirth = date;
    let validations = Object.assign({}, this.state.validation);
    validations.dateOfBirth = "";
    this.setState({
      validation: validations,
      customer: formData
    });
  }
  ifFormValid() {
    if (this.state.customer.customerAddress == null || this.state.customer.customerAddress.trim() === "" ||
      this.state.customer.customerName == null || this.state.customer.customerName.trim() === "" ||
      this.state.customer.customerEmail == null || this.state.customer.customerEmail.trim() === "" ||
      this.state.customer.dateOfBirth == null || this.state.customer.dateOfBirth === "" ||
      this.state.customer.distributorAddress == null || this.state.customer.distributorAddress.trim() === "" ||
      this.state.customer.distributorContact == null || this.state.customer.distributorContact.trim() === "" ||
      this.state.customer.distributorName == null || this.state.customer.distributorName.trim() === "" ||
      this.state.customer.mobile == null || this.state.customer.mobile.trim() === ""
    ) {
      return true
    }
    return false
  }
  save() {
    if (this.state.customer.customerID == "") {
      axios
        .post(api + `/customers`, this.state.customer)
        .then(res => {
          this.props.history.push('/customer/list');
          toast.success("Added Successfully")

        }).catch(err => {
          toast.error("Something went wrong");

        });
    } else {
      axios
        .put(api + `/customers/` + this.props.match.params.employeeID, this.state.customer)
        .then(res => {
          const customer = res.data
          this.props.history.push('/customer/list');
          toast.success("Updated Successfully")
        }).catch(err => {
          toast.error("Something went wrong");

        });;
    }

  }
  render() {

    return (
      <CustomerSaveUi
        customer={this.state.customer}
        validation={this.state.validation}
        handleChange={this.handleChange}
        handleInputChange={this.handleInputChange}
        save={this.save}
        validate={this.validate}
        ifFormValid={this.ifFormValid}
        handleInputChange={this.handleInputChange}
        save={this.save}
        validate={this.validate}
        ifFormValid={this.ifFormValid}
      />
    )
  }
}

export default CustomerSave;

