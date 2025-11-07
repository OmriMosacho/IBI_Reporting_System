import { useState, useEffect } from 'react';
import { api } from '../../ApiRequest';
import './Table.css';

export default function CustomersTable({ token }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    api.get('fetch_table', { tableName: 'customers' })
      .then((data) => setCustomers(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load customers');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p className="error">{error}</p>;

  const total = customers.rows?.length || 0;

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>Customers Overview ({total} Rows)</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show Table' : 'Hide Table'}
        </button>
      </div>

      {!collapsed && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Join Date</th>
              <th>Tenure (Years)</th>
              <th>Segment</th>
            </tr>
          </thead>
          <tbody>
            {customers.rows?.map((c) => (
              <tr key={c.customerid}>
                <td>{c.customerid}</td>
                <td>{c.customername}</td>
                <td>{new Date(c.joindate).toISOString().split('T')[0]}</td>
                <td>{c.tenureyears}</td>
                <td>
                  <span className={`badge ${c.segment?.toLowerCase()}`}>{c.segment}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
