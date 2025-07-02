/*
|--------------------------------------------------
| npm imports
|--------------------------------------------------
*/
import React,  { useCallback, useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*
|--------------------------------------------------
| Local imports
|--------------------------------------------------
*/
import Loader from "./Loader";
import CustomerModal from "./CustomerModal";
import CustomersContext from "../CustomersContext";

/*
|--------------------------------------------------
| Component: CustomerView where customer data is displayed
|--------------------------------------------------
*/
const CustomerView = () => {
  const {customers, setCustomers} = useContext(CustomersContext); // State to hold customer data
  const [message, setMessage] = useState(""); // State to hold delete message
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [page, setPage] = useState(1); // State to manage pagination
  // const pageSize = 10; // Number of customers per page 

  /*
  |--------------------------------------------------
  | State to manage selected customer and modal visibility
  |--------------------------------------------------
  */

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /*
  |--------------------------------------------------
  | useLocation and useNavigate hooks to manage routing
  | for unncessary re-renders
  |--------------------------------------------------
  */
  const location = useLocation();
  const navigate  = useNavigate();


  /*
  |--------------------------------------------------
  | functions to fetch and manage customer data from API
  |--------------------------------------------------
  */
  


  const fetchCustomers = useCallback ( async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(
        `https://fakerapi.it/api/v2/persons?_quantity=50`
      );
      const data = await response.json();
      /*
    |--------------------------------------------------
    | // Set the customer data to state easy to use in the UI 
    |--------------------------------------------------
    */
      setCustomers(data.data);
      console.log("fetched");
      setPage(1); // Reset to first page after fetching new data
      setMessage("");
    } catch (error) {
      console.error("There was an error fetching the customers!", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  }, [ setCustomers]);
  

    /*
    |--------------------------------------------------
    | fetchCustomers function is called when the component mounts
    |--------------------------------------------------
    */
   useEffect(() => {
    /*
    |--------------------------------------------------
    | If the user is coming back from ViewProfile, we skip the fetch
    | to avoid unnecessary API calls
    |--------------------------------------------------
    */
    if (location.state?.wasEdited) {
    // router state cleanup so it fires only once
    navigate(location.pathname, { replace: true, state: null });
    return;                      
  } 
    if (customers.length===0 ) {
          fetchCustomers();
    }// fetch only if no data yet
  }, [fetchCustomers,location, navigate,customers.length]); 

    /*
    |--------------------------------------------------
    | Pagination logic to manage which customers to display
    |--------------------------------------------------
    */
   const PAGE_SIZE = 10;
   const freshFetchRef = useRef(false); // to avoid re-fetching on every render
    const [pageRows, setPageRows] = useState([]);  // rows shown now
    /*
    | whenever `page` changes OR customers were freshly fetched,
    | freeze the rows for *that* page into `pageRows`.
    |  We rely on an extra ref flag to know “fresh fetch”.
    |--------------------------------------------------
    */
    useEffect(() => {
    // detect a brand‑new fetch
    if (freshFetchRef.current) {
      freshFetchRef.current = false;    // consume flag
      setPageRows(customers.slice(0, PAGE_SIZE));
      return;
    }

    // normal page change -> slice once
    const start = (page - 1) * PAGE_SIZE;
    const slice = customers.slice(start, start + PAGE_SIZE);
    setPageRows(slice);
  }, [page]);

  /* mark fresh fetch whenever fetchCustomers completes */
  useEffect(() => {
    if (customers.length > 0) freshFetchRef.current = true;
  }, [customers]);

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));

 
  /*
   |--------------------------------------------------
   | funtion to handle previous page 
   |--------------------------------------------------
   */
  const handlePrevClick = () => {
    setPage((p) => Math.max(p - 1, 1));
  };
  /*
   |--------------------------------------------------
   | funtion to handle Next page
   |--------------------------------------------------
   */

  const handleNextClick = () => {
    setPage((p) => Math.min(p + 1, totalPages));
  };
  /*
   |--------------------------------------------------
   | funtion to Delete customer for the UI
   |--------------------------------------------------
   */
  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setPageRows((prev) => prev.filter((c) => c.id !== id));
    setMessage("User deleted (locally)");
  };
    /*
  |--------------------------------------------------
  | useEffect to clear message after 3 seconds
  |--------------------------------------------------
  */

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /*
  |--------------------------------------------------
  | Function to handle customer click to open modal
  |--------------------------------------------------
  */
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  /*
  |--------------------------------------------------
  | Function to handle modal close
  |--------------------------------------------------
  */
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };


  /*
|--------------------------------------------------
|styling the component
|--------------------------------------------------
*/
  const tableStyle = {
    color: "rgb(98, 92, 141)",
    fontWeight: "LIGHT",
    background: "rgb(248, 251, 255)",
  };


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2 ">
        <h4>Customer View</h4>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2 bg-light form fa-solid fa-search "
            style={{ width: "320px", height: "30px" }}
            placeholder="Search transactions"
          />
          <button
            onClick={fetchCustomers}
            className="btn btn-primary btn-sm"
            style={{ width: "80px" }}
          >
            Refresh
          </button>
          <button className="btn ms-2 btn-sm ">View All</button>
        </div>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <table
        className="table"
        style={{ borderBottom: "1px solid rgb(243, 240, 240)" }}
      >
        <thead>
          <tr>
            <th className="text-start" style={tableStyle}>
              Customer Name
            </th>
            <th className="text-start" style={tableStyle}>
              Email
            </th>
            <th className="text-start" style={tableStyle}>
              Loan Type
            </th>
            <th className="text-start" style={tableStyle}>
              Outstanding Blc
            </th>
            <th className="text-start" style={tableStyle}>
              Status
            </th>
            <th className="text-start" style={tableStyle}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                <Loader />
              </td>
            </tr>
          ) : (
            Array.isArray(pageRows) &&
            pageRows.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => handleCustomerClick(customer)} // CHANGED
                style={{ cursor: "pointer" }}
              >
                <td className="text-start">
                  {customer.firstname} {customer.lastname}
                </td>
                <td className="text-start">{customer.email}</td>
                <td className="text-start">
                  {customer.loanType === "female" ? "paid" : "Ongoing"}
                </td>
                <td className="text-start">
                  {customer.gender === "female" ? "N10.000" : "N20.000"}
                </td>
                <td className="text-start">
                  <span
                    className={`badge  ${
                      customer.status === "Paid" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {customer.status || "Unknown"}
                  </span>
                </td>
                <td className="text-start">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // NEW – stop row click
                      deleteCustomer(customer.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!loading && pageRows.length === 0 && (
        <div className="alert alert-info text-center">
          No customers found.{" "}
          <button
            onClick={fetchCustomers}
            className="btn btn-sm btn-primary ms-2"
          >
            Refresh
          </button>
        </div>
      )}
      <div className="text-center mt-2 ">
        <button
          disabled={page <= 1}
          type="button"
          className="btn btn-primary btn-sm m-2 "
          onClick={handlePrevClick}
        >
          &larr; Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          className="btn btn-primary btn-sm"
          onClick={handleNextClick}
        >
          Next &rarr;
        </button>
      </div>

      { /*
      |--------------------------------------------------
      | This modal is triggered when a customer row is clicked
      | It shows detailed information about the selected customer
      |--------------------------------------------------
      */ }

      <CustomerModal
        key={selectedCustomer?.id}
        customer={selectedCustomer}
        visible={showModal}
        onClose={handleModalClose}
      />
    </div>
  );
};
export default CustomerView;