import React, { Component } from 'react';

class NotAuthorize extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="clearfix">
                <h1 className="float-left display-3 mr-4">402</h1>
                <h4 className="pt-3">You are Not Authoeize to access this page</h4>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotAuthorize;
