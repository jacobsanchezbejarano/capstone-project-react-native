import { useRef, useEffect } from 'react';

export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateName = (name) => {
    return /^[a-zA-Z]+$/.test(name) && name.trim().length > 0;
    
};

export function getSectionListData(data) {
    const formattedData = Object.values(data.reduce((acc, { category, id, price, title }) => {
      if (!acc[category]) acc[category] = { title: category, data: [] };
      acc[category].data.push({ id, title, price });
      return acc;
    }, {}));
    
    return formattedData;
  }
  
export function useUpdateEffect(effect, dependencies = []) {
    const isInitialMount = useRef(true);
  
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        return effect();
      }
    }, dependencies);
}
  