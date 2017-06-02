import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { createBrowserHistory } from 'history';
import CheckAuthoriztion from '../../Components/CheckAuthoriztion/checkAuthoriztion';
import { api } from '../../../config';
const pdfConverter = require('jspdf');
export const history = createBrowserHistory();
var config = {
    headers: { 'Cache-Control': "no-cache, no-store, must-revalidate", 'Content-Type': 'application/json' }

};
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
            totalCount: 0,
            currentPageNumber: 1,
            searchString: '',
            loader: 'none',
            sortDir: 'asc',
            sort: { col: '', dir: '' }
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
        this.handleSort = this.handleSort.bind(this);
        this.searchRequests = [];
    }

    componentWillMount() {
        if (localStorage.getItem('loggedInUserPermission') !== null) {
          var logggedInUserPermission = JSON.parse(localStorage.getItem('loggedInUserPermission'));
          
              if (logggedInUserPermission.indexOf('OB.R') === -1) {
                  window.location.href='/#/not-authorize'
                  return;
          }
     }
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
    handleSort(key, dir, e) {
        this.setState({ loader: '' });
        var elementArray = document.getElementsByClassName('ns');
        var len = 0;
        while (elementArray.length > len) {
            elementArray[len].className = 'ns';
            ++len;
        }
        document.getElementsByClassName('fa-long-arrow-up')[0] ? document.getElementsByClassName('fa-long-arrow-up')[0].className = 'ns' : true;
        document.getElementsByClassName('fa-long-arrow-down')[0] ? document.getElementsByClassName('fa-long-arrow-down')[0].className = 'ns' : true;
        axios.get(api + `/customers?searchQuery=` + this.state.searchString + `&orderBy=` + key + ' ' + this.state.sortDir, config)
            .then(res => {
                const customers = res.data.map(obj => obj)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                const pageSize = JSON.parse(res.headers['x-pagination']).pageSize;
                this.setState({ pageCount: totalPageCount });
                this.setState({ pageSize: pageSize });
                this.setState({ customers });
                this.setState({ loader: 'none' });
            });
        this.setState({ sortDir: this.state.sortDir == 'asc' ? 'desc' : 'asc' });
        e.target.children[0].className = this.state.sortDir == 'asc' ? 'fa fa-long-arrow-up arrow' : 'fa fa-long-arrow-down arrow'
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

    toggleExport(e) {
        e.preventDefault();
        this.setState({
            modalExport: !this.state.modalExport
        });
    }
    toggleExportPdf(e) {
        e.preventDefault();
        this.setState({
            modalExportPdf: !this.state.modalExportPdf
        });
    }
    exportPdf(type, e) {
        var url = '';

        switch (type) {
            case 'a':
                url = '?pageSize=' + this.state.totalCount
                break;
            case 'v':
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.pageSize + '&pageNumber=' + this.state.currentPageNumber
                break;
            case 'f':
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.totalCount
                break;
            default:
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.pageSize + '&pageNumber=' + this.state.currentPageNumber
        }
        this.setState({
            modalExportPdf: !this.state.modalExportPdf
        });
        window.open(api + '/customers/ExportToPdf' + url, '_blank');

    }
    export(type, e) {
        var url = '';

        switch (type) {
            case 'a':
                url = '?pageSize=' + this.state.totalCount
                break;
            case 'v':
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.pageSize + '&pageNumber=' + this.state.currentPageNumber
                break;
            case 'f':
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.totalCount
                break;
            default:
                url = '?searchQuery=' + this.state.searchString + '&pageSize=' + this.state.pageSize + '&pageNumber=' + this.state.currentPageNumber
        }

        this.setState({
            modalExport: !this.state.modalExport
        });
        window.open(api + '/customers/ExportToExcel' + url, '_blank');

        //this.props.history.push('/customers/ExportToExcel');
        //axios.get(api + `/customers/ExportToExcel`,config)

    }
    clearSearchRequests() {
        this.searchRequests.forEach((timer) => {
            clearTimeout(timer);
        });

    }
    handleInputChange(e) {
        var search = e.target.value;
        this.clearSearchRequests();
        this.searchRequests.push(setTimeout(() => {
            axios.get(api + `/customers?searchQuery=` + search, config)
                .then(res => {
                    const customers = res.data.map(obj => obj)
                    const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                    const pageSize = JSON.parse(res.headers['x-pagination']).pageSize;
                    this.setState({
                        pageCount: totalPageCount,
                        pageSize: pageSize,
                        customers: customers,
                        searchString: search,
                        loader: 'none'
                    });
                }).catch(err => {
                    this.setState({
                        customer: {},
                        loader: 'none'
                    });
                    toast.error("Something went wrong");

                });
        }, 500)
        );

    }

    componentDidMount() {
        console.log(process.env.NODE_ENV);
        this.setState({ loader: '' });
        axios.get(api + `/customers`, config)
            .then(res => {
                const customers = res.data.map(obj => obj)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                const pageSize = JSON.parse(res.headers['x-pagination']).pageSize;
                this.setState({ pageCount: totalPageCount });
                this.setState({ pageSize: pageSize });
                this.setState({ customers });
                this.setState({ totalCount: totalPageCount * 10 });
                this.setState({ loader: 'none' });
            }).catch(err => {
                this.setState({
                    customer: {},
                    loader: 'none'
                });
                toast.error("Something went wrong");

            });
    }
    handlePageClick(data) {
        this.setState({ loader: '' });
        let pageNumber = data.selected + 1;
        axios.get(api + `/customers?searchQuery=` + this.state.searchString + `&pageNumber=` + pageNumber + `&pageSize=` + this.state.pageSize, config)
            .then(res => {
                const customers = res.data.map(obj => obj)
                const totalPageCount = Math.ceil((JSON.parse(res.headers['x-pagination']).totalCount) / 10);
                this.setState({ pageCount: totalPageCount })
                this.setState({ customers });
                this.setState({ currentPageNumber: pageNumber });
                this.setState({ loader: 'none' });
            }).catch(err => {
                this.setState({
                    customer: {},
                    loader: 'none'
                });
                toast.error("Something went wrong");

            });
    };
    delete(id, e) {
        this.setState({ loader: '' });
        axios.delete(api + `/customers/` + id)
            .then(res => {
                this.setState({
                    modal: this.state.modal ? !this.state.modal : false,
                    modalDelete: this.state.modalDelete ? !this.state.modalDelete : false,
                    customer: {}
                });
                toast.success("Deleted Successfully");
                this.setState({ loader: 'none' });
                axios.get(api + `/customers`, config)
                    .then(res => {
                        const customers = res.data.map(obj => obj)
                        this.setState({ customers });

                    });

            }).catch(err => {
                this.setState({
                    modal: this.state.modal ? !this.state.modal : false,
                    modalDelete: this.state.modalDelete ? !this.state.modalDelete : false,
                    customer: {},
                    loader: 'none'
                });
                toast.error("Something went wrong");

            });
    }



    renderCustomers() {
        moment.locale('en');
        console.log(this.state.customers)
        if (this.state.customers.length > 0) {
            return (
                Object.keys(this.state.customers).map((key) => {

                    return (

                        <tr key={key}>
                            <td style={{ backgroundColor: this.state.customers[key].status ? '#4dbd74' : '#f86c6b' }}> </td>
                            <td>
                                <a href="" onClick={this.toggle.bind(this, key)}>
                                    {this.state.customers[key].customerName}
                                </a>
                            </td>
                            <td className="five">{this.state.customers[key].mobile}</td>
                            <td className="four">{this.state.customers[key].customerEmail}</td>
                            <td className="three">{moment(this.state.customers[key].dateOfBirth).format('D MMM, Y')} </td>
                            <td className="two">{this.state.customers[key].distributorName}</td>
                            <td className="one">{this.state.customers[key].distributorContact}</td>
                            <td>
                                {/*<div className="mobile ">
                                    <span className="fa fa-ellipsis-h btn btn-primary btn-sm "></span>
                                    <div>
                                        <Link to={'/customer/edit/' + this.state.customers[key].customerID}>
                                            <span className="fa fa-pencil edit"></span>
                                        </Link>
                                        <span className="fa fa-trash-o delete" onClick={this.toggleDelete.bind(this, key)}></span>
                                    </div>
                                </div>*/}
                                <div className="screen">
                                     <CheckAuthoriztion permissions={['OB.U']}>
                                         <Link to={'/customer/edit/' + this.state.customers[key].customerID}>
                                           <span className="fa fa-pencil edit"></span>
                                        </Link>
                                    </CheckAuthoriztion>
                                    <CheckAuthoriztion permissions={['OB.D']}>
                                        <span className="fa fa-trash-o delete" onClick={this.toggleDelete.bind(this, key)}></span>
                                    </CheckAuthoriztion>
                                </div>
                            </td>
                        </tr>
                    )


                })
            )
        } else {
            return (
                <tr >
                    <td colSpan='9' style={{ textAlign: 'center' }}> <strong>No Results found Please Search Again. </strong></td>
                </tr>
            )

        }

    }
    render() {
        let paginate;
        if (window.innerWidth > 580) {
            paginate = <ReactPaginate previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={<a>...</a>}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
        } else {
            paginate = <ReactPaginate previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={<a >...</a>}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />

        }
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
                                        <CheckAuthoriztion permissions={['OB.C']}>
                                            <Link to={'/customer/add'} className="btn btn-primary button-custom-inner" ><i className="fa fa-file-excel-o"></i> Add New Customer</Link>
                                            {'  '}
                                        </CheckAuthoriztion>
                                        <button onClick={this.toggleExport.bind(this)} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Excel</button>
                                        {'   '}
                                        <button onClick={this.toggleExportPdf.bind(this)} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Pdf</button>
                                    </div>
                                    <div className="col-lg-4 search-custom">
                                        <input
                                            id="search"
                                            type="text"
                                            onKeyUp={this.handleInputChange.bind(this)}
                                            placeholder=" Search"
                                            style={{ float: 'right', height: '35px' }} />

                                    </div>
                                    <br /><br />
                                </div>
                                <Table responsive id="table-to-xls" className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th onClick={this.handleSort.bind(this, 'customerName', 'asc')}>Customer Name<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th className="five" onClick={this.handleSort.bind(this, 'mobile', 'asc')}>Contact Details<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th className="four" onClick={this.handleSort.bind(this, 'customerEmail', 'asc')}>Email id<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th className="three" onClick={this.handleSort.bind(this, 'dateOfBirth', 'asc')}>Date of Birth<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th className="two" onClick={this.handleSort.bind(this, 'distributorName', 'asc')}>Distributor Name<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th className="one" onClick={this.handleSort.bind(this, 'distributorContact', 'asc')}>Distributor Contact<i className="fa fa-arrows-v arrow ns" /></th>
                                            <th style={{ textAlign: 'center' }}>Action Items</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCustomers()}
                                    </tbody>
                                </Table>

                                <div style={{ paddingTop: '20px' }}>
                                    {paginate}
                                </div>


                                <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this, '')} className="my-modal">

                                    <ModalHeader toggle={this.toggle.bind(this, '')}>Consumer Detail</ModalHeader>
                                    <ModalBody>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Customer Name : </strong></div>
                                            <div className="col-lg-7">{this.state.customer.customerName}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Mobile :</strong></div>
                                            <div className="col-lg-7">{this.state.customer.mobile}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Landline :</strong></div>
                                            <div className="col-lg-7">{this.state.customer.landline}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Email id : </strong></div>
                                            <div className="col-lg-7">{this.state.customer.customerEmail}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Date of Birth :</strong></div>
                                            <div className="col-lg-7">{moment(this.state.customer.dateOfBirth).format('d MMM, Y')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Customer Address :</strong></div>
                                            <div className="col-lg-7">{this.state.customer.customerAddress}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Distributor Name : </strong></div>
                                            <div className="col-lg-7">{this.state.customer.customerName}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Distributor Contact :</strong></div>
                                            <div className="col-lg-7">{this.state.customer.distributorContact}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-5"><strong>Distributor Address :</strong></div>
                                            <div className="col-lg-7">{this.state.customer.distributorAddress}</div>
                                        </div>


                                    </ModalBody>
                                    <ModalFooter>
                                         <CheckAuthoriztion permissions={['OB.U']}>
                                            <Link className="btn btn-primary" to={'/customer/edit/' + this.state.customer.customerID}>Edit</Link>{' '}
                                        </CheckAuthoriztion>
                                         <CheckAuthoriztion permissions={['OB.D']}>
                                            <Button color="secondary" onClick={this.delete.bind(this, this.state.customer.customerID)}>Delete</Button>
                                        </CheckAuthoriztion>
                                    </ModalFooter>
                                </Modal>


                                <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete.bind(this, '')} className="my-modal">
                                    <ModalHeader toggle={this.toggleDelete.bind(this, '')}>Delete</ModalHeader>
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
                                    <ModalHeader toggle={this.toggleExport.bind(this)}>Export as Excel File.</ModalHeader>
                                    <ModalBody>
                                        How many records do you want to export ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.export.bind(this, 'a')}>All Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.export.bind(this, 'v')}>Current page Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.export.bind(this, 'f')}>All searched Results</Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal isOpen={this.state.modalExportPdf} toggle={this.toggleExportPdf.bind(this)} className="my-modal">
                                    <ModalHeader toggle={this.toggleExportPdf.bind(this)}>Export as PDF File.</ModalHeader>
                                    <ModalBody>
                                        How many records do you want to export ?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.exportPdf.bind(this, 'a')}>All Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.exportPdf.bind(this, 'v')}>Current page Results</Button>
                                        {' '}
                                        <Button color="primary" onClick={this.exportPdf.bind(this, 'f')}>All searched Results</Button>

                                    </ModalFooter>
                                </Modal>
                                <div id="loader-wrapper" style={{ display: this.state.loader }}>
                                    <div id="loader"></div>
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
// 