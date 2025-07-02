/*
|--------------------------------------------------
|npm imports
|--------------------------------------------------
*/
import React from 'react';
import {  BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*
|--------------------------------------------------
|Local imports
|--------------------------------------------------
*/
import CustomerView from './components/CustomerView';
import ViewProfile from './components/ViewProfile';
import { CustomersProvider } from './CustomersContext';

const App = () => {
    
    return (
        <CustomersProvider>
        <Router basename="/interndhip-practise" >
            <Routes>
                <Route path="/"   element={<CustomerView />} /> 
                <Route path="/profile" element={<ViewProfile/>} />
            </Routes>     
        </Router>
        </CustomersProvider>
    );
    
};

export default App;
