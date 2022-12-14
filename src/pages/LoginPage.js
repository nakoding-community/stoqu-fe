import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Link, Tooltip, Container, Typography } from '@mui/material';

// components
import Page from '../components/Page';
import Image from '../components/Image';

// sections
import { LoginForm } from '../components/auth/login';

// assets
import { LogoImageV3, BackgroundLoginV3 } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundImage: `url(${BackgroundLoginV3})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <Page title="Login">
      <RootStyle>
        <Container maxWidth="sm">
          <ContentStyle>
            <div
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              }}
            >
              <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    Masuk ke Inama Wangi
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Masukkan Email dan Password Anda.</Typography>
                </Box>

                <Tooltip placement="right">
                  <>
                    <Image disabledEffect src={LogoImageV3} sx={{ width: 32, height: 32 }} />
                  </>
                </Tooltip>
              </Stack>

              <LoginForm />
            </div>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
