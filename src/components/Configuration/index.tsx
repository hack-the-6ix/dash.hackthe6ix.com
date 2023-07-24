import { ReactNode, useState } from 'react';

import * as config from '../../config';
import { ConfigContext } from './context';

export interface ConfigurationProviderProps {
  children: ReactNode;
}

export default function ConfigurationProvider({
  children,
}: ConfigurationProviderProps) {
  const [_config] = useState(config);

  return (
    <ConfigContext.Provider value={_config}>{children}</ConfigContext.Provider>
  );
}
