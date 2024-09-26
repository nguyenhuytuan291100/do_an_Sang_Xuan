import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from 'pages/App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { apiClient } from 'services/apiService';
import { SWRConfig } from 'swr';
const fetcher = (url:string) => apiClient(url).then(res=>res.data)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <SWRConfig
        value={{
          fetcher,
          onErrorRetry:(error,key,config,revalidate,{retryCount}) =>{
            if(error.status === 404) return;
            if(error.status === 403) return;
            if(retryCount >= 0) return;
            setTimeout(() => revalidate({retryCount}), 5000);
          },
          refreshInterval:5000
        }}
      >
        <App />
      </SWRConfig>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

