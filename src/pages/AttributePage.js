// @mui
import { Container, Stack } from '@mui/material';

// hooks
import useSettings from '../hooks/useSettings';

import Page from '../components/Page';

import AttributeList from '../components/attribute/AttributeList';
import AttributeBrand from '../components/attribute/AttributeBrand';

export default function AttributeApp() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Atribut">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <AttributeList />

        <Stack sx={{ marginTop: '50px' }} />

        <AttributeBrand />
      </Container>
    </Page>
  );
}
