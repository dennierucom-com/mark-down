import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentMatchIndex: number;
    totalMatches: number;
    setTotalMatches: (count: number) => void;
    nextMatch: () => void;
    prevMatch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // 0-indexed internally, display as 1-indexed
    const [totalMatches, setTotalMatches] = useState(0);

    const nextMatch = () => {
        if (totalMatches === 0) return;
        setCurrentMatchIndex((prev) => (prev + 1) % totalMatches);
    };

    const prevMatch = () => {
        if (totalMatches === 0) return;
        setCurrentMatchIndex((prev) => (prev - 1 + totalMatches) % totalMatches);
    };

    const handleSetSearchTerm = (term: string) => {
        setSearchTerm(term);
        setCurrentMatchIndex(0); // Reset index on new search
    };

    return (
        <SearchContext.Provider
            value={{
                searchTerm,
                setSearchTerm: handleSetSearchTerm,
                currentMatchIndex,
                totalMatches,
                setTotalMatches,
                nextMatch,
                prevMatch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
