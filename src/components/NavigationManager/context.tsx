import React, {createContext, useContext} from "react";

export interface NavigationManagerEntry {
    id: string,
    text: string,
    data?: any
}

export type NavigationManagerHandler = (entry: NavigationManagerEntry) => void;

export interface NavigationManagerContext {
    takeoverNavigation: (newOwner: string, entries: NavigationManagerEntry[], handler: NavigationManagerHandler) => boolean,
    navigationEntries: NavigationManagerEntry[],
    owner: string,
    onNavigation?: React.MutableRefObject<NavigationManagerHandler>,
}


export const NavigationManagerContext = createContext<NavigationManagerContext>({
    takeoverNavigation: () => false,
    navigationEntries: [],
    owner: ""
});

export function useNavigationManager() {
    return useContext(NavigationManagerContext);
}