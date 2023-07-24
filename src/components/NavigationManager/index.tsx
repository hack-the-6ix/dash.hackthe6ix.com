import {ReactNode, useCallback, useMemo, useRef, useState} from "react";
import {NavigationManagerEntry, NavigationManagerContext, NavigationManagerHandler, NavBottomMode} from "./context";

export interface NavigationManagerProps {
    children: ReactNode;
}
export default function NavigationManager({
    children
} : NavigationManagerProps) {
    const [entries, setEntries] = useState<NavigationManagerEntry[]>([]);
    const [owner, setOwner] = useState<string>("");
    const [activeEntry, setActiveEntry] = useState<number>(0);
    const [navBottomMode, setNavBottomMode] = useState<NavBottomMode>("None");
    const onNavigation = useRef<NavigationManagerHandler>(() => {});

    const takeoverNavigation = useCallback((newOwner: string, bottomMode: NavBottomMode, entries: NavigationManagerEntry[], handler: NavigationManagerHandler) => {
        if(newOwner !== owner) {
            setOwner(newOwner);
            setEntries(entries);
            setNavBottomMode(bottomMode);
            onNavigation.current = handler;

            return true;
        }
        return false;
    }, [owner]);

    const context = useMemo(() => ({
        takeoverNavigation,
        navigationEntries: entries,
        onNavigation,
        owner,
        activeEntry,
        setActiveEntry,
        navBottomMode
    }), [owner, entries, takeoverNavigation, activeEntry, setActiveEntry]);

    return (
        <NavigationManagerContext.Provider value={context}>
            {children}
        </NavigationManagerContext.Provider>
    )
}