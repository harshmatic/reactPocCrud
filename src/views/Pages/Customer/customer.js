import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
class Customer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            modal: false,
            customer: {},
        };
        this.toggle = this.toggle.bind(this);
        this.delete = this.delete.bind(this);
        this.renderCustomers = this.renderCustomers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    toggle(key, e) {
        e.preventDefault();
        if (!this.state.modal) {
            this.setState({ customer: this.state.customers[key] })
            this.setState({
                modal: !this.state.modal
            });
        } else {
            this.setState({
                modal: false
            });
        }

    }
    handleInputChange(e) {
         axios.get(`http://192.168.101.162:6060/api/customers?searchQuery=`+e.target.value)
            .then(res => {
                const customers = res.data.map(obj => obj)
                console.log(customers)
                this.setState({ customers });
            });

    }

    componentDidMount() {
        axios.get(`http://192.168.101.162:6060/api/customers`)
            .then(res => {
                const customers = res.data.map(obj => obj)
                console.log(customers)
                this.setState({ customers });
            });
    }

    delete(id, e) {
        axios.delete(`http://192.168.101.162:6060/api/customers/` + id)
            .then(res => {
                this.setState({
                    modal: !this.state.modal,
                    customer: {}
                });
                this.props.history.push('/customer/list');
                toast("Deleted Successfully")


            });
    }



    renderCustomers() {
        moment.locale('en');

        return (

            Object.keys(this.state.customers).map((key) => {

                return (
                    <tr key={key}>
                        <td>
                            {/*<Link to={"/customer/edit/" + this.state.customers[key].employeeID}>
                                {this.state.customers[key].firstName} {this.state.customers[key].lastName}
                            </Link>*/}
                            <a href="" onClick={this.toggle.bind(this, key)}>
                                {this.state.customers[key].customerName}
                            </a>
                        </td>
                        <td>{this.state.customers[key].mobile}</td>
                        <td>{this.state.customers[key].customerEmail}</td>
                        <td>{moment(this.state.customers[key].dateOfBirth).format('d MMM, Y')} </td>
                        <td style={{ display: 'none' }}>{this.state.customers[key].customerAddress}</td>
                        <td>{this.state.customers[key].distributorName}</td>
                        <td>{this.state.customers[key].distributorContact}</td>
                        <td style={{ display: 'none' }}>{this.state.customers[key].distributorAddress}</td>
                        {/* <td style={{visibility:'hidden'}}>{this.state.customers[key].customerAddress}</td>
                        <td style={{visibility:'hidden'}}>{this.state.customers[key].distributorAddress}</td>*/}

                        <td>
                            {this.state.customers[key].status ?
                                <span className="badge badge-success">Active</span>
                                :
                                <span className="badge badge-danger">In Active</span>
                            }
                        </td>
                    </tr>
                )
            })
        )
    }
    render() {

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                Customer Table
                            </div>

                            <div className="card-block">
                                <Link to={'/customer/add'} className="btn btn-primary" ><i className="fa fa-file-excel-o"></i> Add New Customer</Link> {'  '}
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="btn btn-primary"
                                    table="table-to-xls"
                                    filename="CustomerDetails"
                                    sheet="Customer"
                                    buttonText="Download as XLS" />  {'   '}
                               <button type="button" className="btn btn-primary"><i className="fa fa-file-pdf-o"></i> Download as Pdf</button>
                                    {/*<span >
                                        <button type="button" className="btn btn-primary"><i className="fa fa-search"></i></button>*/}

                                        <input
                                            type="text"
                                            onKeyUp={this.handleInputChange.bind(this)}
                                            placeholder=" Search"
                                            style={{ float: 'right',    height: '35px' }}/>
                                        {/*/></span>*/}
                                    <br /><br />
                                    <table id="table-to-xls" className="table table-bordered table-striped table-sm">
                                        <thead>
                                            <tr>
                                                <th>Customer Name</th>
                                                <th>Contact Details</th>
                                                <th>Email id</th>
                                                <th>Date of Birth</th>
                                                <th style={{ display: 'none' }}>Distributor Address</th>
                                                <th>Distributor Name</th>
                                                <th>Distributor Contact</th>

                                                <th style={{ display: 'none' }}>Distributor Address</th>
                                                <th>Consumer Status</th>
                                                {/*<th style={{visibility:'hidden'}}>Present Address</th>
                                            <th style={{visibility:'hidden'}}>Distributor Address</th>*/}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.renderCustomers()}
                                        </tbody>
                                    </table>
                                    {/*<div className="row">
                                    <div className="col-lg-6">
                                        <nav>
                                            <ul className="pagination">
                                                <li className="page-item"><a className="page-link" href="#">Prev</a></li>
                                                <li className="page-item active">
                                                    <a className="page-link" href="#">1</a>
                                                </li>
                                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                <li className="page-item"><a className="page-link" href="#">4</a></li>
                                                <li className="page-item"><a className="page-link" href="#">Next</a></li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="col-lg-6">
                                       
                                        <button type="button" className="btn btn-primary"><i className="fa fa-file-excel-o"></i> Export as Excel</button>
                                        <button type="button" className="btn btn-primary"><i className="fa fa-file-pdf-o"></i> Export as Pdf</button>

                                    </div>

                                </div>*/}
                                    <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this, '')} className={this.props.className}>
                                        <ModalHeader toggle={this.toggle}>Consumer Detail</ModalHeader>
                                        <ModalBody>
                                            <div><strong>Customer Name : </strong>{this.state.customer.customerName}</div>
                                            <div> <strong>Mobile :</strong> {this.state.customer.mobile}</div>
                                            <div> <strong>Landline :</strong> {this.state.customer.landline}</div>
                                            <div><strong>Email id : </strong>{this.state.customer.customerEmail}</div>
                                            <div><strong>Date of Birth :</strong> {moment(this.state.customer.dateOfBirth).format('d MMM, Y')}</div>
                                            <div><strong>Customer Address :</strong> {this.state.customer.customerAddress}</div>
                                            <div><strong>Distributor Name : </strong>{this.state.customer.customerName}</div>
                                            <div> <strong>Distributor Contact :</strong> {this.state.customer.distributorContact}</div>
                                            <div> <strong>Distributor Address :</strong> {this.state.customer.distributorAddress}</div>


                                        </ModalBody>
                                        <ModalFooter>
                                            <Link className="btn btn-primary" to={'/customer/edit/' + this.state.customer.customerID}>Edit</Link>{' '}
                                            <Button color="secondary" onClick={this.delete.bind(this, this.state.customer.customerID)}>Delete</Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                )
    }
}

export default Customer;
