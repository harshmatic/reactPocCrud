import React, { Component } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import { api } from '../../../config';
import { CustomerSaveUi } from './customer.save.component';
import { EmailRegex,DateRegex,NumberRegex } from '../../../utils.const' 
export const history = createBrowserHistory();

export class CustomerSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customercustom: {
        "mobile": "",
        "email": "",
        "distributorName": "",
        "distributorAddress": "",
        "distributorContact": "",
      },
      customer: {
        "nationalID": "",
        "customerID": "",
        "firstname": "",
        "lastname": "",
        "landline": "",
        "dateOfBirth": "",
        "address": "",
        "status": true,
        "mobile": "",
        "email": "",
        "distributorName": "",
        "distributorAddress": "",
        "distributorContact": "",
      },
      blankCustomer: {
        "nationalID": "",
        "customerID": "",
        "firstname": "",
        "lastname": "",
        "landline": "",
        "dateOfBirth": "",
        "address": "",
        "status": true,
        "mobile": "",
        "email": "",
        "distributorName": "",
        "distributorAddress": "",
        "distributorContact": "",
      },
      validation: {
        "nationalID": "",
        "firstname": "",
        "lastname": "",
        "mobile": "",
        "email": "",
        "dateOfBirth": "",
        "address": "",
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
    this.validateId = this.validateId.bind(this);
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
          this.setState({ customer,nationalId:false });
        });
    } else {
      this.setState({ disableSave: true,nationalId:true })
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

  handleIdChange(event) {
    const value = event.target.value;

    this.setState({
      nationalId: value
    });
  }

  validateId() {
     axios
        .post(api + `/customers/validate`, {NationalID:document.getElementById("id").value})
        .then(res => {
          if (res.data.errorOcurred=='true') {
             this.setState({customer:this.state.blankCustomer})
            toast.error(res.data.errorMessage);
          } else {
            
             this.setState({customer:Object.assign(res.data, this.state.customercustom)})
             toast.success("Valid National Id");
          }
        }).catch(err => {
          toast.error("Something went wrong");

        });
    //alert(document.getElementById("NationalID").value)
  }

  validate(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let validations = Object.assign({}, this.state.validation);
    if (value.trim() == "") {
      validations[name] = "Required";
    } else if (name === "email") {
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
    } else if (name === "nationalId") {
      if (NumberRegex.test(value)) {
        validations[name] = "";
      } else {
        validations[name] = "Not a valid National ID"
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
    if (this.state.customer.address == null || this.state.customer.address.trim() === "" ||
      this.state.customer.firstname == null || this.state.customer.firstname.trim() === "" ||
       this.state.customer.surname == null || this.state.customer.surname.trim() === "" ||
      this.state.customer.email == null || this.state.customer.email.trim() === "" ||
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
    if (this.state.customer.customerID == "" || !this.state.customer.customerID) {
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
        nationalId={this.state.nationalId}
        handleChange={this.handleChange}
        handleInputChange={this.handleInputChange}
        save={this.save}
        validate={this.validate}
        ifFormValid={this.ifFormValid}
        handleInputChange={this.handleInputChange}
        save={this.save}
        validate={this.validate}
        ifFormValid={this.ifFormValid}
        validateId={this.validateId}
      />
    )
  }
}

export default CustomerSave;

