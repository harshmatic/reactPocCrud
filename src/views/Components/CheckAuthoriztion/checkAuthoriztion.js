import React, {Component} from 'react';

class CheckAuthoriztion extends Component {
    allowed() {
        if (this.props.permissions && this.props.permissions.length > 0) {
            if (localStorage.getItem('loggedInUserPermission') !== null) {
                var logggedInUserPermission = JSON.parse(localStorage.getItem('loggedInUserPermission'));
                for (var i = 0; i < this.props.permissions.length; i++) {
                    if (logggedInUserPermission.indexOf(this.props.permissions[i]) === -1) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return true
    }

    render() {
        if (this.allowed()) {
            return (
                <span>
                    {this.props.children}
                </span>

            )
        } else {
            return (
                <div></div>
            )
        }
    }
}

export default CheckAuthoriztion;
