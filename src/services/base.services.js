import axios from 'axios';
var config = {
    headers: { 'Cache-Control': "no-cache, no-store, must-revalidate", 'Content-Type': 'application/json' }

};

class BaseService {

    getAll(){
      axios.get(api + `/customers`, config)
      .then(res => {
        return res.data.map(obj => obj)
      });
    }

    get(){
      axios.get(api + `/customers`, config)
      .then(res => {
        return res.data.map(obj => obj)
      });
    }    
    put () {
      axios
        .put(api + `/customers/` + this.props.match.params.employeeID, this.state.customer)
        .then(res => {
          return res;
        })
    }

    delete () {
       axios.delete(api + `/customers/` + id)
      .then(res => {
        return res;
        });
    }

    post () {
      axios
        .post(api + `/customers`, this.state.customer)
        .then(res => {
          return res;
        })
        
    }
}