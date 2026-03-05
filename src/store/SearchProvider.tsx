import React, { useState, type ReactNode } from "react";
import { SearchContext } from "./SearchContext";

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
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
