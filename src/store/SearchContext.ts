import { createContext, useContext } from 'react';

export interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentMatchIndex: number; // 0-indexed internally, display as 1-indexed
    totalMatches: number;
    setTotalMatches: (count: number) => void;
    nextMatch: () => void;
    prevMatch: () => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
