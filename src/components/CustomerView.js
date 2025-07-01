/*
|--------------------------------------------------
| npm imports
|--------------------------------------------------
*/
import React, { useEffect, useState } from "react";

/*
|--------------------------------------------------
| Local imports
|--------------------------------------------------
*/

import Loader from "./Loader";
import CustomerModal from "./CustomerModel";

/*
|--------------------------------------------------
| Component: CustomerView where customer data is displayed
|--------------------------------------------------
*/
const CustomerView = () => {
  const [customers, setCustomers] = useState([]); // State to hold customer data
  const [message, setMessage] = useState(""); // State to hold delete message
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [page, setPage] = useState(1); // State to manage pagination

  /*
  |--------------------------------------------------
  | State to manage selected customer and modal visibility
  |--------------------------------------------------
  */

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /*
|--------------------------------------------------
| functions to fetch and manage customer data from API
|--------------------------------------------------
*/
  const fetchCustomers = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await fetch(
        "https://fakerapi.it/api/v2/persons?_quantity=10"
      );
      const data = await response.json();
      /*
    |--------------------------------------------------
    | // Set the customer data to state easy to use in the UI 
    |--------------------------------------------------
    */
      setCustomers(data.data);
      setMessage("");
    } catch (error) {
      console.error("There was an error fetching the customers!", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };
  /*
    |--------------------------------------------------
    | fetchCustomers function is called when the component mounts
    |--------------------------------------------------
    */
  useEffect(() => {
    fetchCustomers();
  }, []);
  /*
   |--------------------------------------------------
   | funtion to handle previous page 
   |--------------------------------------------------
   */
  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchCustomers(); // Re-fetch customers for the previous page
    }
  };
  /*
   |--------------------------------------------------
   | funtion to handle Next page
   |--------------------------------------------------
   */

  const handleNextClick = () => {
    setPage(page + 1);
    fetchCustomers(); // Re-fetch customers for the next page
  };
  /*
   |--------------------------------------------------
   | funtion to Delete customer for the UI
   |--------------------------------------------------
   */
  const deleteCustomer = (customerId) => {
    const updated = customers.filter((customer) => customer.id !== customerId);
    setCustomers(updated); // Remove from UI
    setMessage("User deleted (locally)");
  };
  /*
  |--------------------------------------------------
  | Function to handle customer click to open modal
  |--------------------------------------------------
  */
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    console.log("Selected Customer:", customer);
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
            Array.isArray(customers) &&
            customers.map((customer) => (
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

      {!loading && customers.length === 0 && (
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
      <div className="conatiner text-center  ">
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
          className="btn btn-primary btn-sm"
          onClick={handleNextClick}
        >
          Next &rarr;
        </button>
      </div>
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
