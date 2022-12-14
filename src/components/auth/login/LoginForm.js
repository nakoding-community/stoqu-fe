import { useState } from 'react';

// @mui
import { Stack, Alert, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFormHandler = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const isSuccess = await login(email, password);
    if (!isSuccess) {
      setShowError(true);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={submitFormHandler}>
      <Stack spacing={3}>
        {showError && <Alert severity="error">Email atau password yang Anda masukan salah</Alert>}
        <TextField name="email" label="Alamat Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: '16px' }}
        disabled={!email || !password}
      >
        Masuk
      </LoadingButton>
    </form>
  );
}
