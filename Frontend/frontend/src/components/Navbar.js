// src/components/Navbar.js
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Raw Data</h2>
        <div className="tabs">
          <button
            className={activeTab === 'customers' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          <button
            className={activeTab === 'companies' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={activeTab === 'stocks' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('stocks')}
          >
            Stock Prices
          </button>
        </div>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
