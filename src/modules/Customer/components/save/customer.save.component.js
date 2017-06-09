import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Validation from 'react-validation';
import 'react-datepicker/dist/react-datepicker.css';
import { styles } from '../../../utils.const'
export class CustomerSaveUi extends Component {
  constructor(props) {
    super(props);
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
               {(this.props.nationalId === null || this.props.nationalId)  &&
              <div className="row">
                <div className="form-group  col-sm-3">
                  <label htmlFor="company">National ID*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="id"
                    placeholder="National ID"
                    name='id'
                   //onChange={this.props.handleIdChange}
                    //onBlur={this.props.validate}
                    //value={this.props.nationalId} 
                    />
                  {/*<span style={styles.validationError}> {this.props.validation.NationalID}</span>*/}
                </div>
                <div className="form-group  col-sm-2">
                  <label htmlFor="company">&nbsp; </label>
                  <button onClick={this.props.validateId}
                    className="btn btn-primary form-control">
                    Validate
                  </button>
                </div>
              </div>
               }
              <div className="row">
                {this.props.customer.nationalID &&
                <div className="form-group col-sm-4">
                  
                  <label htmlFor="city">National ID</label><br />
                  {/*<DatePicker
                    selected={moment(this.props.customer.dateOfBirth)}
                    onChange={this.props.handleChange}
                    className="form-control"
                    id="dob"
                    name='dateOfBirth'
                    onBlur={this.props.validate}
                    placeholder="Enter  DOB" />
                  <span style={styles.validationError}> {this.props.validation.dateOfBirth}</span>*/}
                 
                  <span className="form-control" htmlFor="company">{this.props.customer.nationalID}</span>
                </div>
                  }
                <div className="form-group  col-sm-4">
                  <div className="row">
                    {this.props.customer.firstname &&
                    <div className="form-group  col-sm-6">
                      <label htmlFor="company">First Name*</label>
                      {/*<input
                        type="text"
                        className="form-control"
                        id="company"
                        placeholder="First name"
                        name='firstname'
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validate}
                        disabled='disabled'
                        value={this.props.customer.firstname ? this.props.customer.firstname : ''} />
                      <span style={styles.validationError}> {this.props.validation.firstname}</span>*/}
                       <span className="form-control" htmlFor="company">{this.props.customer.firstname}</span>
                    </div>
                    }
                    {this.props.customer.surname &&
                    <div className="form-group  col-sm-6">
                      <label htmlFor="company">Sur Name*</label>
                      {/*<input
                        type="text"
                        className="form-control"
                        id="company"
                        placeholder="Surname"
                        name='surname'
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validate}
                        disabled='disabled'
                        value={this.props.customer.surname ? this.props.customer.surname : ''} />
                      <span style={styles.validationError}> {this.props.validation.surname}</span>*/}
                      
                      <span className="form-control" htmlFor="company" > {this.props.customer.surname}</span>
                      
                    </div>
                    }
                  </div>
                </div>
                {this.props.customer.dateOfBirth &&
                <div className="form-group col-sm-4">
                  
                  <label htmlFor="city">Date Of Birth*</label><br />
                  {/*<DatePicker
                    selected={moment(this.props.customer.dateOfBirth)}
                    onChange={this.props.handleChange}
                    className="form-control"
                    id="dob"
                    name='dateOfBirth'
                    onBlur={this.props.validate}
                    placeholder="Enter  DOB" />
                  <span style={styles.validationError}> {this.props.validation.dateOfBirth}</span>*/}
                 
                  <span className="form-control" htmlFor="company">{moment(this.props.customer.dateOfBirth).format('Do MMM YYYY')}</span>
                </div>
                  }
              </div>
              <div className="row">
                 {this.props.customer.address &&
                <div className="form-group col-sm-12">
                  <label htmlFor="postal-code">Present Address*</label>
                  {/*<textarea
                    id="address"
                    name="textarea-input"
                    rows="4"
                    className="form-control"
                    name='address'
                    onChange={this.props.handleInputChange}
                    onBlur={this.props.validate}
                    value={this.props.customer.address ?this.props.customer.address:''}
                    placeholder="Enter  present address"></textarea>
                  <span style={styles.validationError}> {this.props.validation.address}</span>*/}
                  <span className="form-control" htmlFor="company">{this.props.customer.address ?this.props.customer.address:''}</span>
                </div>
                 }
              </div>
              <div className="row">
                <div className="form-group col-sm-6">
                  <label htmlFor="street">Email ID*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name='email'
                    onChange={this.props.handleInputChange}
                    value={this.props.customer.email}
                    onBlur={this.props.validate}
                    placeholder="Enter  email" />
                  <span style={styles.validationError}> {this.props.validation.email}</span>
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="vat">Contact Number*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vat"
                    name='mobile'
                    onChange={this.props.handleInputChange}
                    value={this.props.customer.mobile}
                    onBlur={this.props.validate}
                    placeholder="Enter  contact number" />
                  <span style={styles.validationError}> {this.props.validation.mobile}</span>
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
                    onChange={this.props.handleInputChange}
                    value={this.props.customer.distributorName}
                    onBlur={this.props.validate}
                    placeholder="Enter ditributor name" />
                  <span style={styles.validationError}> {this.props.validation.distributorName}</span>

                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="country">Distributor Contact*</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name='distributorContact'
                    onChange={this.props.handleInputChange}
                    value={this.props.customer.distributorContact}
                    onBlur={this.props.validate}
                    placeholder="Enter distributor contact" />
                  <span style={styles.validationError}> {this.props.validation.distributorContact}</span>

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
                  onChange={this.props.handleInputChange}
                  value={this.props.customer.distributorAddress}
                  onBlur={this.props.validate}
                  placeholder="Enter ditributor address"></textarea>
                <span style={styles.validationError}> {this.props.validation.distributorAddress}</span>
              </div>
              <div className="form-group">
                <button onClick={this.props.save} className="btn btn-primary" disabled={this.props.ifFormValid()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomerSaveUi;

