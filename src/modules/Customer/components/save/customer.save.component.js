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
              <div className="row">
                <div className="form-group  col-sm-6">
                  <label htmlFor="company">Customer Name*</label>
                  <div className="row">
                    <div className="form-group  col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        placeholder="First name"
                        name='firstname'
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validate}
                        value={this.props.customer.firstname} />
                      <span style={styles.validationError}> {this.props.validation.firstname}</span>
                    </div>
                    <div className="form-group  col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        placeholder="Surname"
                        name='surname'
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validate}
                        value={this.props.customer.surname} />
                      <span style={styles.validationError}> {this.props.validation.surname}</span>
                    </div>
                  </div>
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
                  <label htmlFor="city">Date Of Birth*</label><br />
                  <DatePicker
                    selected={moment(this.props.customer.dateOfBirth)}
                    onChange={this.props.handleChange}
                    className="form-control"
                    id="dob"
                    name='dateOfBirth'
                    onBlur={this.props.validate}
                    placeholder="Enter  DOB" />
                  <span style={styles.validationError}> {this.props.validation.dateOfBirth}</span>
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
                    name='address'
                    onChange={this.props.handleInputChange}
                    onBlur={this.props.validate}
                    value={this.props.customer.address}
                    placeholder="Enter  present address"></textarea>
                  <span style={styles.validationError}> {this.props.validation.address}</span>
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

