// @mui
import { Stack, Button, Typography } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
// assets
import { DocIllustration, ManualBookPDF } from '../../../assets';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { user } = useAuth();

  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Hi, {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Butuh Bantuan?
          <br /> Periksalah dokumentasi kami
        </Typography>
      </div>

      <Button variant="contained" href={ManualBookPDF} target="_blank">
        Dokumentasi
      </Button>
    </Stack>
  );
}
