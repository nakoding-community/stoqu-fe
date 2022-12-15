import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../clientv2/authClient';

export const useLoginUser = (options) => {
  return useMutation((body) => loginUser(body), options);
};
