import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { BrowserRouter } from 'react-router-dom'
import Validation from 'react-validation';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { createBrowserHistory } from 'history';
import {api} from '../../../../config';
export const history = createBrowserHistory();

class CustomerSave extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customer: {
                //"customerID": "",
                "customerName": "",
                "mobile": "",
                //"landline": "",
                "customerEmail": "",
                "dateOfBirth": moment(),
                "customerAddress": "",
                //"status": true,
                "distributorName": "",
                "distributorAddress": "",
                "distributorContact": "",
            },
            validation:{
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
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.validate = this.validate.bind(this);
        this.ifFormValid = this.ifFormValid.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.employeeID) {
            axios
                .get(api+`/customers/` + this.props.match.params.employeeID)
                .then(res => {
                    const customer = res.data
                    this.setState({customer});
                });
        }else{
            this.setState({disableSave:true})
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
    validate(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let validations = Object.assign({}, this.state.validation);
        if(value.trim()==""){
            validations[name] = "Required";
        }else if(name==="customerEmail"){
            if(EmailRegex.test(value)){
                validations[name] = "";
            } else {
                validations[name] ="Not a valid email"
            }
        } else if(name==="dateOfBirth"){
            if(DateRegex.test(value)){
                validations[name] = "";
            } else {
                validations[name] ="Not a valid Date(MM/DD/YYYY)"
            }
        } else if(name==="mobile"||name==="distributorContact"){
            if(NumberRegex.test(value)){
                validations[name] = "";
            } else {
                validations[name] ="Not a valid contact number"
            }
        }else{
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
    ifFormValid(){
        for (var key in this.state.customer) {
              if(this.state.customer[key]===""){
                  return true
              }
        }
        return false
    }
    save(){
        if(this.state.customer.customerID==""){
            axios
                .post(api+`/customers`,this.state.customer)
                .then(res => {
                    this.props.history.push('/customer/list');
                    toast.success("Added Successfully")
                    
                }).catch(err=> {
                toast.error("Something went wrong");
                
            });
        }else{
             axios
                .put(api+`/customers/` + this.props.match.params.employeeID,this.state.customer)
                .then(res => {
                    const customer = res.data
                     this.props.history.push('/customer/list');
                    toast.success("Updated Successfully")
                    this.setState({customer});
                }).catch(err=> {
                toast.error("Something went wrong");
                
            });; 
        }
          
    }
    render() {

        return (

            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <strong>Customer Form</strong>
                        </div>
                        <div className="card-block">
                         <div className="row">
                            <div className="form-group  col-sm-6">
                                <label htmlFor="company">Consumer Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="company"
                                    placeholder="Enter consumer's name"
                                    name='customerName' 
                                    onChange={this.handleInputChange} 
                                    onBlur={this.validate}
                                    value={this.state.customer.customerName}/>
                                   <span style={styles.validationError}> {this.state.validation.customerName}</span>
                            </div>
                            <div className="form-group col-sm-6">
                                <label htmlFor="vat">Contact Number*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vat"
                                    name='mobile' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.mobile}
                                     onBlur={this.validate}
                                    placeholder="Enter consumer's contact number"/>
                                   <span style={styles.validationError}> {this.state.validation.mobile}</span>                                
                            </div>
                            </div>
                         <div className="row">
                            <div className="form-group col-sm-6">
                                <label htmlFor="street">Email ID*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="street"
                                    name='customerEmail' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.customerEmail}
                                     onBlur={this.validate}
                                    placeholder="Enter consumer's email"/>                      
                                <span style={styles.validationError}> {this.state.validation.customerEmail}</span>                                
                            </div>
                            <div className="form-group col-sm-6">
                                    <label htmlFor="city">Date Of Birth*</label><br/>
                                    <DatePicker
                                        selected={moment(this.state.customer.dateOfBirth)}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        id="dob"
                                        name='dateOfBirth' 
                                        onBlur={this.validate}
                                        placeholder="Enter consumer's DOB"/>                      
                                    <span style={styles.validationError}> {this.state.validation.dateOfBirth}</span>  
                            </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-12">
                                    <label htmlFor="postal-code">Present Address*</label>
                                    <textarea
                                        id="address"
                                        name="textarea-input"
                                        rows="4"
                                        className="form-control"
                                        name='customerAddress' 
                                    onChange={this.handleInputChange} 
                                     onBlur={this.validate}
                                    value={this.state.customer.customerAddress}
                                        placeholder="Enter consumer's present address"></textarea>                      
                                <span style={styles.validationError}> {this.state.validation.customerAddress}</span>  
                                </div>
                            </div>
                             <div className="row">
                            <div className="form-group col-sm-6">
                                <label htmlFor="country">Distributor Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="country"
                                     name='distributorName' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorName}
                                     onBlur={this.validate}
                                    placeholder="Enter ditributor name"/>                      
                                <span style={styles.validationError}> {this.state.validation.distributorName}</span>  
                                    
                            </div>
                            <div className="form-group col-sm-6">
                                <label htmlFor="country">Distributor Contact*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="country"
                                     name='distributorContact' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorContact}
                                     onBlur={this.validate}
                                    placeholder="Enter distributor contact"/>                      
                                <span style={styles.validationError}> {this.state.validation.distributorContact}</span>  
                                    
                            </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Address*</label>
                                <textarea
                                    id="address_dist"
                                    name="textarea-input"
                                    rows="4"
                                    className="form-control"
                                     name='distributorAddress' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorAddress}
                                     onBlur={this.validate}
                                    placeholder="Enter ditributor address"></textarea>                      
                                <span style={styles.validationError}> {this.state.validation.distributorAddress}</span>  
                            </div>
                             <div className="form-group">
                                <button onClick={this.save} className="btn btn-primary" disabled={this.ifFormValid()}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomerSave;

const styles={
    validationError: {
        color: 'red',
        margin:'5px 0',
        display: 'inline-block',
    }
}

const EmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NumberRegex = /^\d+$/;
const DateRegex = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;