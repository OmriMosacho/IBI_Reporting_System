import { useState } from 'react';
import Navbar from './Navbar';
import CustomersTable from './tables/CustomersTable';
import CompaniesTable from './tables/CompaniesTable';
import StocksTable from './tables/StocksTable';
import './Dashboard.css';

export default function Dashboard({ token, setToken }) {
  const [activeTab, setActiveTab] = useState('customers');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="dashboard-container">
        {activeTab === 'customers' && <CustomersTable token={token} />}
        {activeTab === 'companies' && <CompaniesTable token={token} />}
        {activeTab === 'stocks' && <StocksTable token={token} />}
      </div>
    </>
  );
}
