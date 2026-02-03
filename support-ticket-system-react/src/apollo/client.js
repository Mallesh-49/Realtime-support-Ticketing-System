import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
  credentials: 'include', // مهم جدًا للجلسة
});

const csrfLink = setContext(async (_, { headers }) => {
  const token = getCookie('XSRF-TOKEN');
  return {
    headers: {
      ...headers,
      'X-XSRF-TOKEN': decodeURIComponent(token),
    },
  };
});

const client = new ApolloClient({
  link: csrfLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;