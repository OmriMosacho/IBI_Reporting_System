import { useState, useEffect } from 'react';
import { api } from '../../ApiRequest';
import './Table.css';

export default function CompaniesTable({ token }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    api.get('fetch_table', { tableName: 'companies' })
      .then((data) => setCompanies(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load companies');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p className="error">{error}</p>;

  const total = companies.rows?.length || 0;

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>Companies Overview ({total} Rows)</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show Table' : 'Hide Table'}
        </button>
      </div>

      {!collapsed && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Company</th>
              <th>Exchange</th>
              <th>Currency</th>
              <th>Sector</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {companies.rows?.map((c) => (
              <tr key={c.ticker}>
                <td>{c.ticker}</td>
                <td>{c.companyname}</td>
                <td>{c.exchange}</td>
                <td>{c.currency}</td>
                <td>{c.sector}</td>
                <td>{c.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
