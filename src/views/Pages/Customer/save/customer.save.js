import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Validation from 'react-validation';
import 'react-datepicker/dist/react-datepicker.css';
class CustomerSave extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customer: {},
            startDate: moment()

        };
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        if (this.props.match.params.employeeID) {
            axios.get(`http://192.168.101.162:6058/api/employees/` + this.props.match.params.employeeID)
                .then(res => {
                    const customer = res.data
                    this.setState({ customer });
                });
        }
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
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
                            <div className="form-group">
                                <label htmlFor="company">Consumer Name*</label>
                                <input type="text" className="form-control" id="company" placeholder="Enter consumer's name"
                                    value={this.state.customer.firstName} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="vat">Contact Number*</label>
                                <input type="text" className="form-control" id="vat" placeholder="Enter consumer's contact number" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="street">Email ID*</label>
                                <input type="text" className="form-control" id="street" placeholder="Enter consumer's email" />
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-4">
                                    <label htmlFor="city">Date Of Birth*</label><br/>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        onChange={this.handleChange}
                                        className="form-control" id="dob" placeholder="Enter consumer's DOB"
                                    />
                                </div>
                                <div className="form-group col-sm-8">
                                    <label htmlFor="postal-code">Present Address*</label>
                                    <textarea id="address" name="textarea-input" rows="9" className="form-control" placeholder="Enter consumer's present address"></textarea>
                                    
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Name*</label>
                                <input type="text" className="form-control" id="country" placeholder="Enter ditributor name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Contact*</label>
                                <input type="text" className="form-control" id="country" placeholder="Enter distributor contact" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Address*</label>
                                <textarea id="address_dist" name="textarea-input" rows="9" className="form-control" placeholder="Enter ditributor address"></textarea>
                                
                            </div>
                            

                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default CustomerSave;
