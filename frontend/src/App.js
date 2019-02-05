import React, { Component } from 'react';
import './App.css';
import { Query } from 'react-apollo';
import { GET_TRANSACTION_BY_ID } from './api/queries';

const txId = 'ef90f4873a27fdb64d09d58447e39f6b855cecd6303188f9648349fdc876592b'

class App extends Component {
  render() {
    return (
      <Query query={GET_TRANSACTION_BY_ID} variables={{ txId }}>
        {({loading, error, data}) => 
          <>
            <h1>
              Welcome to Seiza! 
            </h1>
            <h2>Cardano's next generation blockchain explorer.</h2>
            <p>{!loading && JSON.stringify(data, null, 4)}</p>
          </>
        }
      </Query>
    );
  }
}

export default App;
