import { config } from '@/config';

const generateGoogleErrorCallbackUrl = () => {
  const redirectUrl = new URL(`/auth/sign-in`, config.WEB_URL);
  redirectUrl.searchParams.append('error', 'google callback');
  return redirectUrl;
};

export const googleErrorCallbackUrl = generateGoogleErrorCallbackUrl();
