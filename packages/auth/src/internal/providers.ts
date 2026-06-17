import type { InitAuthOptions } from './validation';

export interface ProviderConfig {
  clientIdField: keyof InitAuthOptions;
  clientSecretField: keyof InitAuthOptions;
  extra: Record<string, unknown>;
  key: string;
  redirectPath: string;
}

export const PROVIDER_CONFIGS = [
  {
    key: 'github',
    clientIdField: 'githubClientId' as const,
    clientSecretField: 'githubClientSecret' as const,
    redirectPath: '/api/auth/callback/github',
    extra: {},
  },
  {
    key: 'twitter',
    clientIdField: 'twitterClientId' as const,
    clientSecretField: 'twitterClientSecret' as const,
    redirectPath: '/api/auth/callback/twitter',
    extra: {},
  },
  {
    key: 'google',
    clientIdField: 'googleClientId' as const,
    clientSecretField: 'googleClientSecret' as const,
    redirectPath: '/api/auth/callback/google',
    extra: { prompt: 'select_account consent' },
  },
  {
    key: 'facebook',
    clientIdField: 'facebookClientId' as const,
    clientSecretField: 'facebookClientSecret' as const,
    redirectPath: '/api/auth/callback/facebook',
    extra: {},
  },
] as const satisfies ProviderConfig[];

function getProviderValue(options: InitAuthOptions, field: keyof InitAuthOptions): string | undefined {
  return options[field] as string | undefined;
}

export function buildSocialProviders(options: InitAuthOptions, productionUrl: string) {
  const providers: Record<string, unknown> = {};

  for (const config of PROVIDER_CONFIGS) {
    const clientId = getProviderValue(options, config.clientIdField);
    const clientSecret = getProviderValue(options, config.clientSecretField);

    if (clientId && clientSecret) {
      providers[config.key] = {
        clientId,
        clientSecret,
        redirectURI: `${productionUrl}${config.redirectPath}`,
        ...config.extra,
      };
    }
  }

  return providers;
}

export function getEnabledProviders(options: InitAuthOptions): string[] {
  const enabled: string[] = [];

  for (const config of PROVIDER_CONFIGS) {
    const clientId = getProviderValue(options, config.clientIdField);
    const clientSecret = getProviderValue(options, config.clientSecretField);

    if (clientId && clientSecret) {
      enabled.push(config.key);
    }
  }

  return enabled;
}
