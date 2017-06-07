import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment';
import { createBrowserHistory } from 'history';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CheckAuthoriztion from '../../../../services/checkAuthoriztion';
import { api } from '../../../config';
import { CustomerList } from './customer.component';
export const history = createBrowserHistory();
var config = {
  headers: { 'Cache-Control': "no-cache, no-store, must-revalidate", 'Content-Type': 'application/json' }

};
export class CustomerListContainer extends Component {

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
      sort: { col: '', dir: '' },
      dropdownOpen: []
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.delete = this.delete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.toggleExport = this.toggleExport.bind(this);
    this.toggleExportPdf = this.toggleExportPdf.bind(this);
    this.export = this.export.bind(this);
    this.exportPdf = this.exportPdf.bind(this);
    this.delete = this.delete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.searchRequests = [];
  }

  componentWillMount() {
    if (localStorage.getItem('loggedInUserPermission') !== null) {
      var logggedInUserPermission = JSON.parse(localStorage.getItem('loggedInUserPermission'));

      if (logggedInUserPermission.indexOf('OB.R') === -1) {
        window.location.href = '/#/not-authorize'
        return;
      }
    }
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
  toggleDropdown(key) {
    let dropdownOpen = Object.assign([], this.state.dropdownOpen);
    dropdownOpen[key] = !dropdownOpen[key]
    this.setState({
      dropdownOpen: dropdownOpen
    });
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



  
  render() {
    return (
      <CustomerList
        customers={this.state.customers}
        containerState = {this.state}
        modal={this.state.modal}
        modalDelete={this.state.modalDelete}
        modalExport={this.state.modalExport}
        modalExportPdf={this.state.modalExportPdf}
        customer={this.state.customer}
        pageCount={this.state.pageCount}
        pageSize={this.state.pageSize}
        totalCount={this.state.totalCount}
        currentPageNumber={this.state.currentPageNumber}
        searchString={this.state.searchString}
        loader={this.state.loader}
        sortDir={this.state.sortDir}
        sort={this.state.sort}
        dropdownOpen={this.state.dropdownOpen}
        toggleDropdown={this.toggleDropdown.bind(this)}
        toggle={this.toggle.bind(this)}
        toggleDelete={this.toggleDelete.bind(this)}
        delete={this.delete.bind(this)}
        handleInputChange={this.handleInputChange.bind(this)}
        handlePageClick={this.handlePageClick.bind(this)}
        toggleExport={this.toggleExport.bind(this)}
        toggleExportPdf={this.toggleExportPdf.bind(this)}
        export={this.export.bind(this)}
        exportPdf={this.exportPdf.bind(this)}
        delete={this.delete.bind(this)}
        handleInputChange={this.handleInputChange.bind(this)}
        handleSort={this.handleSort.bind(this)}
          />

    )
  }
}

export default CustomerListContainer;
