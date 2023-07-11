import {ReactNode, useCallback, useMemo, useRef, useState} from "react";
import {NavigationManagerEntry, NavigationManagerContext, NavigationManagerHandler} from "./context";

export interface NavigationManagerProps {
    children: ReactNode;
}
export default function NavigationManager({
    children
} : NavigationManagerProps) {
    const [entries, setEntries] = useState<NavigationManagerEntry[]>([]);
    const [owner, setOwner] = useState<string>("");
    const onNavigation = useRef<NavigationManagerHandler>(() => {});

    const takeoverNavigation = useCallback((newOwner: string, entries: NavigationManagerEntry[], handler: NavigationManagerHandler) => {
        if(newOwner !== owner) {
            console.log("setting owner", newOwner, owner)
            setOwner(newOwner);
            setEntries(entries);
            onNavigation.current = handler;

            return true;
        }
        return false;
    }, [owner]);

    const context = useMemo(() => ({
        takeoverNavigation,
        navigationEntries: entries,
        onNavigation,
        owner
    }), [owner, entries, takeoverNavigation])

    return (
        <NavigationManagerContext.Provider value={context}>
            {children}
        </NavigationManagerContext.Provider>
    )
}