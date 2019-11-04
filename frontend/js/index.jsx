import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

let BASE_URL;
if(process.env.NODE_ENV !== 'prod') {
    BASE_URL = 'localhost:5000/graphql';
}
else {
    BASE_URL = '';
}
const httpLink = new HttpLink({ uri: BASE_URL });
const cache = new InMemoryCache();
const client = new ApolloClient({
    link: httpLink,
    cache,
});

ReactDOM.render(<ApolloProvider client={client}><App/></ApolloProvider>, document.getElementById("app"));