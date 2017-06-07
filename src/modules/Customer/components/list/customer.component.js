import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import CheckAuthoriztion from '../../../../services/checkAuthoriztion';

export class CustomerList extends Component {

  constructor(props) {
    super(props);
  }

  renderCustomers() {
    moment.locale('en');
    if (this.props.customers.length > 0) {
      return (
        Object.keys(this.props.customers).map((key) => {

          return (

            <tr key={key} style={{ borderLeft: 'solid 5px', borderLeftColor: this.props.customers[key].status ? '#4dbd74' : '#f86c6b' }}>
              <td data-title="Customer Name">
                <a href="" onClick={this.props.toggle.bind(this, key)}>
                  {this.props.customers[key].customerName}
                </a>
              </td>
              <td data-title="Contact" >{this.props.customers[key].mobile}</td>
              <td data-title="Email Id" >{this.props.customers[key].customerEmail}</td>
              <td data-title="DOB" >{moment(this.props.customers[key].dateOfBirth).format('D MMM, Y')} </td>
              <td data-title="Distributor Name" >{this.props.customers[key].distributorName}</td>
              <td data-title="Distributor Contact" >{this.props.customers[key].distributorContact}</td>
              <td data-title="Actions">
                <div className="screen">
                  <div className="hide-mobile">
                    <CheckAuthoriztion permissions={['OB.U']}>
                      <Link to={'/customer/edit/' + this.props.customers[key].customerID}>
                        <span className="fa fa-pencil edit"></span>
                      </Link>
                    </CheckAuthoriztion>
                    <CheckAuthoriztion permissions={['OB.D']}>
                      <span className="fa fa-trash-o delete" onClick={this.props.toggleDelete.bind(this, key)}></span>
                    </CheckAuthoriztion>
                  </div>
                  <div className="mobile">
                    <Dropdown isOpen={this.props.dropdownOpen[key]} toggle={this.props.toggleDropdown.bind(null, key)}>
                      <span onClick={this.props.toggleDropdown.bind(null, key)}
                        className=" active dropdown p-0"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded={this.props.dropdownOpen[key]}>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                      <DropdownMenu>
                        <DropdownItem>
                          <CheckAuthoriztion permissions={['OB.U']}>
                            <Link to={'/customer/edit/' + this.props.customers[key].customerID}>
                              <span className="fa fa-pencil edit"> Edit</span>
                            </Link>
                          </CheckAuthoriztion>
                        </DropdownItem>
                        <DropdownItem>
                          <CheckAuthoriztion permissions={['OB.D']}>
                            <span className="fa fa-trash-o delete" onClick={this.props.toggleDelete.bind(this, key)}> Delete</span>
                          </CheckAuthoriztion>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
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
        pageCount={this.props.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.props.handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"} />
    } else {
      paginate = <ReactPaginate previousLabel={"<<"}
        nextLabel={">>"}
        breakLabel={<a >...</a>}
        breakClassName={"break-me"}
        pageCount={this.props.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={this.props.handlePageClick}
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
                  <div className="col-md-8 button-custom">
                    <CheckAuthoriztion permissions={['OB.C']}>
                      <Link to={'/customer/add'} className="btn btn-primary button-custom-inner" ><i className="fa fa-file-excel-o"></i> Add New Customer</Link>
                      {'  '}
                    </CheckAuthoriztion>
                    <button onClick={this.props.toggleExport.bind(this)} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Excel</button>
                    {'   '}
                    <button onClick={this.props.toggleExportPdf.bind(this)} type="button" className="btn btn-primary button-custom-inner"><i className="fa fa-file-pdf-o"></i> Export as Pdf</button>
                  </div>
                  <div className="col-md-4 search-custom">
                    <input
                      id="search"
                      type="text"
                      onKeyUp={this.props.handleInputChange.bind(this)}
                      placeholder=" Search"
                      style={{ float: 'right', height: '35px' }} />

                  </div>
                  <br /><br />
                </div>
                <div id="no-more-tables">
                  <Table responsive id="table-to-xls" className="table table-bordered table-striped table-sm">
                    <thead>
                      <tr>
                        <th onClick={this.props.handleSort.bind(this, 'customerName', 'asc')}>Customer Name<i className="fa fa-arrows-v arrow ns" /></th>
                        <th onClick={this.props.handleSort.bind(this, 'mobile', 'asc')}>Contact Details<i className="fa fa-arrows-v arrow ns" /></th>
                        <th onClick={this.props.handleSort.bind(this, 'customerEmail', 'asc')}>Email id<i className="fa fa-arrows-v arrow ns" /></th>
                        <th onClick={this.props.handleSort.bind(this, 'dateOfBirth', 'asc')}>Date of Birth<i className="fa fa-arrows-v arrow ns" /></th>
                        <th onClick={this.props.handleSort.bind(this, 'distributorName', 'asc')}>Distributor Name<i className="fa fa-arrows-v arrow ns" /></th>
                        <th onClick={this.props.handleSort.bind(this, 'distributorContact', 'asc')}>Distributor Contact<i className="fa fa-arrows-v arrow ns" /></th>

                        <th style={{ textAlign: 'center' }}>
                          <CheckAuthoriztion permissions={['OB.U']}>
                            Action Items
                                                </CheckAuthoriztion>
                        </th>


                      </tr>
                    </thead>
                    <tbody>
                      {this.renderCustomers()}
                    </tbody>
                  </Table>
                </div>

                <div style={{ paddingTop: '20px' }}>
                  {paginate}
                </div>


                <Modal isOpen={this.props.modal} toggle={this.props.toggle.bind(this, '')} className="my-modal">

                  <ModalHeader toggle={this.props.toggle.bind(this, '')}>Consumer Detail</ModalHeader>
                  <ModalBody>
                    <div className="row">
                      <div className="col-lg-5"><strong>Customer Name : </strong></div>
                      <div className="col-lg-7">{this.props.customer.customerName}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Mobile :</strong></div>
                      <div className="col-lg-7">{this.props.customer.mobile}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Landline :</strong></div>
                      <div className="col-lg-7">{this.props.customer.landline}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Email id : </strong></div>
                      <div className="col-lg-7">{this.props.customer.customerEmail}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Date of Birth :</strong></div>
                      <div className="col-lg-7">{moment(this.props.customer.dateOfBirth).format('d MMM, Y')}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Customer Address :</strong></div>
                      <div className="col-lg-7">{this.props.customer.customerAddress}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Distributor Name : </strong></div>
                      <div className="col-lg-7">{this.props.customer.customerName}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Distributor Contact :</strong></div>
                      <div className="col-lg-7">{this.props.customer.distributorContact}</div>
                    </div>
                    <div className="row">
                      <div className="col-lg-5"><strong>Distributor Address :</strong></div>
                      <div className="col-lg-7">{this.props.customer.distributorAddress}</div>
                    </div>


                  </ModalBody>
                  <ModalFooter>
                    <CheckAuthoriztion permissions={['OB.U']}>
                      <Link className="btn btn-primary" to={'/customer/edit/' + this.props.customer.customerID}>Edit</Link>{' '}
                    </CheckAuthoriztion>
                    <CheckAuthoriztion permissions={['OB.D']}>
                      <Button color="secondary" onClick={this.props.delete.bind(this, this.props.customer.customerID)}>Delete</Button>
                    </CheckAuthoriztion>
                  </ModalFooter>
                </Modal>


                <Modal isOpen={this.props.modalDelete} toggle={this.props.toggleDelete.bind(this, '')} className="my-modal">
                  <ModalHeader toggle={this.props.toggleDelete.bind(this, '')}>Delete</ModalHeader>
                  <ModalBody>
                    Are You sure you want to delete this record.
                                    </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.props.delete.bind(this, this.props.customer.customerID)}>Yes</Button>
                    {' '}
                    <Button color="secondary" onClick={this.props.toggleDelete.bind(this, '')}>NO</Button>

                  </ModalFooter>
                </Modal>
                <Modal isOpen={this.props.modalExport} toggle={this.props.toggleExport.bind(this)} className="my-modal">
                  <ModalHeader toggle={this.props.toggleExport.bind(this)}>Export as Excel File.</ModalHeader>
                  <ModalBody>
                    How many records do you want to export ?
                                    </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.props.export.bind(this, 'a')}>All Results</Button>
                    {' '}
                    <Button color="primary" onClick={this.props.export.bind(this, 'v')}>Current page Results</Button>
                    {' '}
                    <Button color="primary" onClick={this.props.export.bind(this, 'f')}>All searched Results</Button>
                  </ModalFooter>
                </Modal>
                <Modal isOpen={this.props.modalExportPdf} toggle={this.props.toggleExportPdf.bind(this)} className="my-modal">
                  <ModalHeader toggle={this.props.toggleExportPdf.bind(this)}>Export as PDF File.</ModalHeader>
                  <ModalBody>
                    How many records do you want to export ?
                                    </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.props.exportPdf.bind(this, 'a')}>All Results</Button>
                    {' '}
                    <Button color="primary" onClick={this.props.exportPdf.bind(this, 'v')}>Current page Results</Button>
                    {' '}
                    <Button color="primary" onClick={this.props.exportPdf.bind(this, 'f')}>All searched Results</Button>

                  </ModalFooter>
                </Modal>
                <div id="loader-wrapper" style={{ display: this.props.loader }}>
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

export default CustomerList;
// 