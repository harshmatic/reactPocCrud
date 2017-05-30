import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
class Customer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            modal: false,
            customer: {}
        };
        this.toggle = this.toggle.bind(this);
        this.delete = this.delete.bind(this);
        this.renderCustomers = this.renderCustomers.bind(this);
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

    componentDidMount() {
        axios.get(`http://192.168.101.162:6058/api/employees`)
            .then(res => {
                const customers = res.data.map(obj => obj)
                console.log(customers)
                this.setState({ customers });
            });
    }

    delete(id, e) {
        // axios.delete(`http://192.168.101.162:6058/api/employees/` + id)
        //     .then(res => {
        //         this.setState({
        //         modal: !this.state.modal,
        //         customer:{}
        //     });
        this.setState({
                modal: !this.state.modal,
                customer:{}
            });
                toast("Deleted Successfully") 
                    
                
           // });
    }



    renderCustomers() {

        return (
            Object.keys(this.state.customers).map((key) => {

                return (
                    <tr key={key}>
                        <td>
                            {/*<Link to={"/customer/edit/" + this.state.customers[key].employeeID}>
                                {this.state.customers[key].firstName} {this.state.customers[key].lastName}
                            </Link>*/}
                            <a href="" onClick={this.toggle.bind(this, key)}>
                                {this.state.customers[key].firstName} {this.state.customers[key].lastName}
                            </a>
                        </td>
                        <td>2012/01/01</td>
                        <td>Member</td>
                        <td>{this.state.customers[key].firstName} {this.state.customers[key].lastName}</td>
                        <td>2012/01/01</td>
                        <td>Member</td>
                        <td>{this.state.customers[key].firstName} {this.state.customers[key].lastName}</td>
                        <td>2012/01/01</td>
                        <td>
                            <span className="badge badge-success">Active</span>
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
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th>Consumer Name</th>
                                            <th>Contact Details</th>
                                            <th>Email id</th>
                                            <th>Date of Birth</th>
                                            <th>Present Address</th>
                                            <th>Distributor Name</th>
                                            <th>Distributor Address</th>
                                            <th>Distributor Contact</th>
                                            <th>Consumer Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCustomers()}
                                    </tbody>
                                </table>
                                <div className="row">
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
                                        <Link to={'/customer/add'} className="btn btn-primary" ><i className="fa fa-file-excel-o"></i> Add New Customer</Link>
                                        <button type="button" className="btn btn-primary"><i className="fa fa-file-excel-o"></i> Export as Excel</button>
                                        <button type="button" className="btn btn-primary"><i className="fa fa-file-pdf-o"></i> Export as Pdf</button>

                                    </div>

                                </div>
                                <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this, '')} className={this.props.className}>
                                    <ModalHeader toggle={this.toggle}>Consumer Detail</ModalHeader>
                                    <ModalBody>
                                        Consumer Name : {this.state.customer.firstName}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Link className="btn btn-primary" to={'/customer/edit/' + this.state.customer.employeeID}>Edit</Link>{' '}
                                        <Button color="secondary" onClick={this.delete.bind(this, this.state.customer.employeeID)}>Delete</Button>
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
