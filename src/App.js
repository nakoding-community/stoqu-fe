import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Router from './routes';
import ThemeProvider from './theme';
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <RtlLayout>
          <MotionLazyContainer>
            <ProgressBarStyle />
            <Settings />
            <ScrollToTop />
            <QueryClientProvider client={queryClient}>
              <Router />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </MotionLazyContainer>
        </RtlLayout>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
