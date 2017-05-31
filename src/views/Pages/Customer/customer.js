import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { api } from '../../../config';
const pdfConverter = require('jspdf');

class Customer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            modal: false,
            modalDelete: false,
            modalExport: false,
            modalExportPdf: false,
            customer: {},
            pageCount: 0,
            pageSize: 0,
            searchString: '',
            loader:'none'
        };
        this.toggle = this.toggle.bind(this);
        this.toggleDelete = this.toggleDelete.bind(this);
        this.delete = this.delete.bind(this);
        this.renderCustomers = this.renderCustomers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.toggleExport = this.toggleExport.bind(this);
        this.toggleExportPdf = this.toggleExportPdf.bind(this);
        this.export = this.export.bind(this);
        this.exportPdf = this.exportPdf.bind(this);
        this.delete = this.delete.bind(this);
        this.renderCustomers = this.renderCustomers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePdf = this.handlePdf.bind(this);
    }


    handlePdf() {
        var columns = [
            { title: "Customer Name", dataKey: "customerName" },
            { title: "Mobile", dataKey: "mobile" },
            { title: "Email id", dataKey: "customerEmail" },
            { title: "Date of Birth", dataKey: "dateOfBirth" },
            { title: "Customer Address", dataKey: "customerAddress" },
            { title: "Distributor Name", dataKey: "ditributorName" },
            { title: "Distributor Contact", dataKey: "distributorContact" },
            { title: "Distributor Address", dataKey: "distributorAddress" },
        ]
        const pdf = new pdfConverter('p', 'pt');
        pdf.autoTable(columns, this.state.customers);
        pdf.save('test.pdf');
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
    toggleDelete(key, e) {
        e.preventDefault();
        if (!this.state.modalDelete) {
            this.setState({ customer: this.state.customers[key] })
            this.setState({
                modalDelete: !this.state.modalDelete
            });
        } else {
            this.setState({
                modalDelete: false
            });
        }

    }

    toggleExport(key, e) {
        e.preventDefault();
        this.setState({
            modalExport: !this.state.modalExport
        });
    }
    toggleExportPdf(key, e) {
        e.preventDefault();
        this.setState({
            modalExportPdf: !this.state.modalExportPdf
        });
    }
    exportPdf(e) {
        console.log("got it")
    }
    export(e) {
        console.log("got it")
    }
    handleInputChange(e) {
        var search = e.target.value;
        axios.get(api + `/customers?searchQuery=` + search)
            .then(res => {
                const customers = res.data.map(obj => obj)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                const pageSize = JSON.parse(res.headers['x-pagination']).pageSize;
                this.setState({
                    pageCount: totalPageCount,
                    pageSize: pageSize,
                    customers: customers,
                    searchString: search
                });
            });

    }

    componentDidMount() {
        this.setState({loader:''});
        axios.get(api + `/customers`)
            .then(res => {
                const customers = res.data.map(obj => obj)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                const pageSize = JSON.parse(res.headers['x-pagination']).pageSize;
                this.setState({ pageCount: totalPageCount });
                this.setState({ pageSize: pageSize });
                this.setState({ customers });
                 this.setState({loader:'none'});
            });
    }
    handlePageClick(data) {
         this.setState({loader:''});
        let pageNumber = data.selected + 1;
        axios.get(api + `/customers?searchQuery=` + this.state.searchString + `&pageNumber=` + pageNumber + `&pageSize=` + this.state.pageSize)
            .then(res => {
                const customers = res.data.map(obj => obj)
                console.log(customers)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                this.setState({ pageCount: totalPageCount })
                this.setState({ customers });
                this.setState({loader:'none'});
            });
    };
    delete(id, e) {
        this.setState({loader:''});
        axios.delete(api + `/customers/` + id)
            .then(res => {
                this.setState({
                    modal: this.state.modal ? !this.state.modal : false,
                    modalDelete: this.state.modalDelete ? !this.state.modalDelete : false,
                    customer: {}
                });
                toast.success("Deleted Successfully");
                axios.get(api + `/customers`)
                    .then(res => {
                        const customers = res.data.map(obj => obj)
                        console.log(customers)
                        this.setState({ customers });
                        this.setState({loader:'none'});
                    });

            }).catch(err => {
                this.setState({
                    modal: this.state.modal ? !this.state.modal : false,
                    modalDelete: this.state.modalDelete ? !this.state.modalDelete : false,
                    customer: {},
                    loader:'none'
                });
                toast.error("Something went wrong");

            });
    }



    renderCustomers() {
        moment.locale('en');

        return (

            Object.keys(this.state.customers).map((key) => {

                return (
                    <tr key={key}>
                        <td>
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
                        <td>
                            <p data-placement="top" data-toggle="tooltip" title="Edit">
                                <Link className="btn btn-primary btn-xs" to={'/customer/edit/' + this.state.customers[key].customerID}>
                                    {/*<button className="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" >*/}
                                    <span className="fa fa-pencil"></span></Link></p></td>
                        <td>
                            <p data-placement="top" data-toggle="tooltip" title="Delete">
                                <button className="btn btn-danger btn-xs" onClick={this.toggleDelete.bind(this, key)} >
                                    <span className="fa fa-trash-o"></span></button></p>
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
                                <strong>Customer Table</strong>
                            </div>

                            <div className="card-block">
                                <div className="row">
                                    <div className="col-lg-8 button-custom">
                                        <Link to={'/customer/add'} className="btn btn-primary button-custom-inner" ><i className="fa fa-file-excel-o"></i> Add New Customer</Link> {'  '}

                                        {/*<ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="btn btn-primary"
                                    table="table-to-xls"
                                    filename="CustomerDetails"
                                    sheet="Customer"
                                    buttonText="Download as XLS" />  {'   '}*/}

                                        <button onClick={this.toggleExport} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Excel</button>{'   '}


                                        <button onClick={this.toggleExportPdf} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Pdf</button>
                                    </div>
                                    {/*<span >
                                        <button type="button" className="btn btn-primary"><i className="fa fa-search"></i></button>*/}
                                    <div className="col-lg-4 search-custom">
                                        <input
                                            type="text"
                                            onKeyUp={this.handleInputChange.bind(this)}
                                            placeholder=" Search"
                                            style={{ float: 'right', height: '35px' }} />
                                        {/*/></span>*/}
                                    </div>
                                    <br /><br />
                                </div>
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
                                            <th>Edit</th>
                                            <th>Delete</th>
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
                                <div>
                                    <ReactPaginate previousLabel={"previous"}
                                        nextLabel={"next"}
                                        breakLabel={<a href="">...</a>}
                                        breakClassName={"break-me"}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"} />
                                </div>


                                <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this, '')} className="my-modal">

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


                                <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete.bind(this)} className="my-modal">
                                    <ModalHeader toggle={this.toggleDelete}>Delete</ModalHeader>
                                    <ModalBody>
                                        Are You sure you want to delete this record.
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.delete.bind(this, this.state.customer.customerID)}>Yes</Button>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggleDelete.bind(this, '')}>NO</Button>

                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={this.state.modalExport} toggle={this.toggleExport.bind(this)} className="my-modal">
                                    <ModalHeader toggle={this.toggleExport}>Export as Excel File.</ModalHeader>
                                    <ModalBody>
                                        How many records do you want to export ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.export.bind(this)}>All Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.export.bind(this)}>Visible Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.export.bind(this)}>Filtered Results</Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={this.state.modalExportPdf} toggle={this.toggleExportPdf.bind(this)} className="my-modal">
                                    <ModalHeader toggle={this.toggleExportPdf}>Export as PDF File.</ModalHeader>
                                    <ModalBody>
                                        How many records do you want to export ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.exportPdf.bind(this)}>All Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.exportPdf.bind(this)}>Visible Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.exportPdf.bind(this)}>Filtered Results</Button>

                                    </ModalFooter>
                                </Modal>
                                <div id="loader-wrapper" style={{display:this.state.loader}}>
                                    <div id="loader"></div>

                                    <div className="loader-section section-left"></div>
                                    <div className="loader-section section-right"></div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Customer;
