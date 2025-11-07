/**
 * @file Dashboard.js
 * @module Dashboard
 * @description
 * Main dashboard component that renders multiple DataTable instances
 * for customers, companies, and stock prices. Each uses the reusable
 * DataTable component to fetch and display data.
 */

import { useState } from 'react';
import Navbar from './Navbar';
import DataTable from './tables/DataTable';
import './Dashboard.css';

export default function Dashboard({ token, setToken }) {
  const [activeTab, setActiveTab] = useState('customers');

  /**
   * @function handleLogout
   * @description Clears JWT token and logs out user.
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="dashboard-container">
        {activeTab === 'customers' && (
          <DataTable
            tableName="customers"
            title="Customers Overview"
            columns={['customerid', 'customername', 'joindate', 'tenureyears', 'segment']}
            token={token}
          />
        )}

        {activeTab === 'companies' && (
          <DataTable
            tableName="companies"
            title="Companies Overview"
            columns={['ticker', 'companyname', 'exchange', 'currency', 'sector', 'country']}
            token={token}
          />
        )}

        {activeTab === 'stocks' && (
          <DataTable
            tableName="stock_prices"
            title="Stock Prices"
            columns={['ticker', 'pricedate', 'close', 'currency']}
            token={token}
          />
        )}
      </div>
    </>
  );
}
