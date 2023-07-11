import './utils/yup';

import { StyleProvider } from '@ht6/react-ui';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import AuthenticationProvider from './components/Authentication';
import ConfigurationProvider from './components/Configuration';
import reportWebVitals from './reportWebVitals';
import NavigationManager from "./components/NavigationManager";

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <StyleProvider>
      <BrowserRouter>
        <ConfigurationProvider>
          <AuthenticationProvider>
            <NavigationManager>
              <App />
            </NavigationManager>
          </AuthenticationProvider>
        </ConfigurationProvider>
      </BrowserRouter>
    </StyleProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
