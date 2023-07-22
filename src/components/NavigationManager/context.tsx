import React, {createContext, useContext} from "react";

export interface NavigationManagerEntry {
    id: string,
    text: string,
    data?: any
}

export type NavigationManagerHandler = (entry: NavigationManagerEntry) => void;

export type NavBottomMode = "ApplicationStatus" | "EventInfo" | "None";

export interface NavigationManagerContext {
    takeoverNavigation: (newOwner: string, bottomMode: NavBottomMode, entries: NavigationManagerEntry[], handler: NavigationManagerHandler) => boolean,
    navigationEntries: NavigationManagerEntry[],
    owner: string,
    onNavigation?: React.MutableRefObject<NavigationManagerHandler>,
    activeEntry: number,
    setActiveEntry: (newEntry: number) => void | ((oldEntry: number) => number),
    navBottomMode: string
}

export const NavigationManagerContext = createContext<NavigationManagerContext>({
    takeoverNavigation: () => false,
    navigationEntries: [],
    owner: "",
    setActiveEntry: () => {},
    activeEntry: 0,
    navBottomMode: "None"
});

export function useNavigationManager() {
    return useContext(NavigationManagerContext);
}