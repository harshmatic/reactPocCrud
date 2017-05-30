import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { BrowserRouter } from 'react-router-dom'
import Validation from 'react-validation';
import 'react-datepicker/dist/react-datepicker.css';
class CustomerSave extends Component {
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
         //   dateOfBirth: moment()

        };
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.employeeID) {
            axios
                .get(`http://192.168.101.162:6060/api/customers/` + this.props.match.params.employeeID)
                .then(res => {
                    const customer = res.data
                    this.setState({customer});
                });
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
    handleChange(date) {
        let formData = Object.assign({}, this.state.customer);
        formData.dateOfBirth = date;
        this.setState({
            customer: formData
        });
        this.setState({
            customer: formData
        });
    }
    save(){
        if(this.state.customer.customerID==""){
            axios
                .post(`http://192.168.101.162:6060/api/customers`,this.state.customer)
                .then(res => {
                    BrowserRouter.push('/#/customer/list')
                });
        }else{
             axios
                .put(`http://192.168.101.162:6060/api/customers/` + this.props.match.params.employeeID,this.state.customer)
                .then(res => {
                    const customer = res.data
                    this.setState({customer});
                }); 
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
                            <div className="form-group">
                                <label htmlFor="company">Consumer Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="company"
                                    placeholder="Enter consumer's name"
                                    name='customerName' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.customerName}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="vat">Contact Number*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vat"
                                    name='mobile' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.mobile}
                                    placeholder="Enter consumer's contact number"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="street">Email ID*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="street"
                                    name='customerEmail' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.customerEmail}
                                    placeholder="Enter consumer's email"/>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-4">
                                    <label htmlFor="city">Date Of Birth*</label><br/>
                                    <DatePicker
                                        selected={moment(this.state.customer.dateOfBirth)}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        id="dob"
                                        name='dateOfBirth' 
                                        placeholder="Enter consumer's DOB"/>
                                </div>
                                <div className="form-group col-sm-8">
                                    <label htmlFor="postal-code">Present Address*</label>
                                    <textarea
                                        id="address"
                                        name="textarea-input"
                                        rows="9"
                                        className="form-control"
                                         name='customerAddress' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.customerAddress}
                                        placeholder="Enter consumer's present address"></textarea>

                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="country"
                                     name='distributorName' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorName}
                                    placeholder="Enter ditributor name"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Contact*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="country"
                                     name='distributorContact' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorContact}
                                    placeholder="Enter distributor contact"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Distributor Address*</label>
                                <textarea
                                    id="address_dist"
                                    name="textarea-input"
                                    rows="9"
                                    className="form-control"
                                     name='distributorAddress' 
                                    onChange={this.handleInputChange} 
                                    value={this.state.customer.distributorAddress}
                                    placeholder="Enter ditributor address"></textarea>

                            </div>
                             <div className="form-group">
                                <button onClick={this.save}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomerSave;
