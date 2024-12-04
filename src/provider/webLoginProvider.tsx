// 'use client';
import { NetworkType } from '@portkey/did-ui-react';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';

import { WebLoginProvider, init } from '@aelf-web-login/wallet-adapter-react';
import useWebLoginConfig from 'hooks/useWebLoginConfig';
import { useMemo } from 'react';

export function Provider({ children }: { children: React.ReactNode }) {
  const config = useWebLoginConfig();
  const bridgeAPI = useMemo(() => {
    return config ? init(config) : null;
  }, [config]);
  return bridgeAPI ? <WebLoginProvider bridgeAPI={bridgeAPI}>{children}</WebLoginProvider> : <>{children}</>;
}

export default Provider;
