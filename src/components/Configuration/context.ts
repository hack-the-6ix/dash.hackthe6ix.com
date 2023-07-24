import { createContext, useContext } from 'react';

import * as config from '../../config';

export const ConfigContext = createContext<typeof config>(config);

export function useConfig() {
  return useContext(ConfigContext);
}
