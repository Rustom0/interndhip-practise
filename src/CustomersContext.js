import React, { createContext, useState, useEffect } from "react";

const CustomersContext = createContext();

export const CustomersProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  return (
    <CustomersContext.Provider value={{ customers, setCustomers }}>
      {children}
    </CustomersContext.Provider>
  );
};

export default CustomersContext;