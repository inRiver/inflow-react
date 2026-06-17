import { useState, useEffect, useMemo } from 'react';
import { getAllComponents, getComponentLabel } from '../showcase/categories';

export const useComponentSearch = (query: string): string[] => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query changes (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter components based on debounced query
  const filteredComponents = useMemo(() => {
    const allComponents = getAllComponents();

    // Return all components if query is empty
    if (!debouncedQuery.trim()) {
      return allComponents;
    }

    // Normalize: lowercase, remove spaces/hyphens
    const normalizeString = (str: string) => 
      str.toLowerCase().replace(/[\s-]/g, '');
    
    const normalizedQuery = normalizeString(debouncedQuery);

    // Match against both slug and display label
    return allComponents.filter((component) => {
      const normalizedSlug = normalizeString(component);
      const normalizedLabel = normalizeString(getComponentLabel(component));
      
      return normalizedSlug.includes(normalizedQuery) || 
             normalizedLabel.includes(normalizedQuery);
    });
  }, [debouncedQuery]);

  return filteredComponents;
};
