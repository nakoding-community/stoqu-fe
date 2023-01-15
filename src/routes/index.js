import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" replace />, index: true },
        { path: 'app', element: <DashboardPage /> },
        { path: 'attribute', element: <AttributePage /> },
        { path: 'product', element: <ProductPage /> },
        { path: 'stock', element: <StockPage /> },
        { path: 'order', element: <OrderPage /> },
        // { path: 'order/:id', element: <OrderDetailPage /> },
        { path: 'order/:id', element: <OrderDetailPageV2 /> },
        { path: 'report/order', element: <ReportPage /> },
        { path: 'report/product', element: <ReportProductPage /> },
        { path: 'settings/user', element: <SettingsUserPage /> },
        { path: 'settings/dollar-conversion', element: <SettingsDollarConversionPage /> },
        { path: 'settings/remaind-stock', element: <SettingsRemaindStockPage /> },
        { path: 'settings/conversion-type', element: <SettingsConversionTypePage /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to="/dashboard/app" replace />,
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Auth
const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

// Dashboard
const DashboardPage = Loadable(lazy(() => import('../pages/DashboardPage')));
const AttributePage = Loadable(lazy(() => import('../pages/AttributePage')));
const ProductPage = Loadable(lazy(() => import('../pages/ProductPage')));
const StockPage = Loadable(lazy(() => import('../pages/StockPage')));
const OrderPage = Loadable(lazy(() => import('../pages/OrderPage')));
// const OrderDetailPage = Loadable(lazy(() => import('../pages/OrderDetailPage')));
const OrderDetailPageV2 = Loadable(lazy(() => import('../pages/OrderDetailPageV2')));
const ReportPage = Loadable(lazy(() => import('../pages/ReportPage')));
const ReportProductPage = Loadable(lazy(() => import('../pages/ReportProductPage')));
const SettingsUserPage = Loadable(lazy(() => import('../pages/SettingsUserPage')));
const SettingsDollarConversionPage = Loadable(lazy(() => import('../pages/SettingsDollarConversionPage')));
const SettingsRemaindStockPage = Loadable(lazy(() => import('../pages/SettingsRemaindStockPage')));
const SettingsConversionTypePage = Loadable(lazy(() => import('../pages/SettingsConversionTypePage')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
