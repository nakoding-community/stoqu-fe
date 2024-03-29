// scroll bar
// import './wdyr';
import 'simplebar/src/simplebar.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// contexts
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from 'material-ui-confirm';
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import { AuthProvider } from './contexts/JWTContext';

//
import App from './App';

// ----------------------------------------------------------------------

const Application = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 0,
        staleTime: 0,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <ConfirmProvider
          defaultOptions={{
            description: "You won't be able to revert this!",
            confirmationButtonProps: {
              color: 'error',
            },
          }}
        >
          <AuthProvider>
            <HelmetProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                  <CollapseDrawerProvider>
                    <BrowserRouter>
                      <App />
                    </BrowserRouter>
                  </CollapseDrawerProvider>
                </SettingsProvider>
              </LocalizationProvider>
            </HelmetProvider>
          </AuthProvider>
        </ConfirmProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

ReactDOM.render(<Application />, document.getElementById('root'));
