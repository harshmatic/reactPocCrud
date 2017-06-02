import React, {Component} from 'react';
import axios from 'axios';
import {api} from '../../../config';
import { toast } from 'react-toastify';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName:"",
      Password:""
    }
    this.login=this.login.bind(this);
    this.getPermissions=this.getPermissions.bind(this);
  }
  login(){
    if(this.state.username!=="" && this.state.password!==""){
          axios.post(`http://192.168.101.162:6058/api/auth/token`,this.state)
                .then(res => {
                   localStorage.setItem('accessToken',res.data.token) 
                   toast.success('Login Successfull');
                   this.getPermissions()
                }).catch(err => {
                    toast.error(err.response.data);
                });;
    }  
  }
  getPermissions(){
    let headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+localStorage.getItem('accessToken')
          }
        axios.get(`http://192.168.101.162:6058/api/permissions`, {headers})
                .then(res => {
                   localStorage.setItem('loggedInUserPermission',JSON.stringify(res.data)) 
                    this.props.history.push('/customer/list');
                });
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <div className="input-group mb-3">
                      <span className="input-group-addon">
                        <i className="icon-user"></i>
                      </span>
                      <input type="text" value={this.state.UserName} onChange={(e)=>this.setState({UserName:e.target.value})} className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-addon">
                        <i className="icon-lock"></i>
                      </span>
                      <input type="password" value={this.state.Password} onChange={(e)=>this.setState({Password:e.target.value})}  className="form-control" placeholder="Password"/>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="button" onClick={this.login} className="btn btn-primary px-4">Login</button>
                      </div>
                      <div className="col-6 text-right">
                        <button type="button" className="btn btn-link px-0">Forgot password?</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
