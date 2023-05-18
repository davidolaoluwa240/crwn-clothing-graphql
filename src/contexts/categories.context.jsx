import { createContext, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const CategoriesContext = createContext({
  categoriesMap: {},
  loading: false,
});

const COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    if (!data) return;
    const { collections } = data;
    const collectionsMap = collections.reduce((acc, collection) => {
      const { title, items } = collection;
      acc[title.toUpperCase()] = items;
      return acc;
    }, {});
    setCategoriesMap(collectionsMap);
  }, [data]);

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
