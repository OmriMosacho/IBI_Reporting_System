import { useState, useEffect } from 'react';
import { api } from '../../ApiRequest';
import './Table.css';

export default function StocksTable({ token }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    api.get('fetch_table', { tableName: 'stock_prices' })
      .then((data) => setStocks(data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load stock prices');
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p>Loading stock prices...</p>;
  if (error) return <p className="error">{error}</p>;

  const total = stocks.rows?.length || 0;

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>Stock Prices ({total} Rows)</h2>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show Table' : 'Hide Table'}
        </button>
      </div>

      {!collapsed && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Date</th>
              <th>Close</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {stocks.rows?.map((s, i) => (
              <tr key={`${s.ticker}-${i}`}>
                <td>{s.ticker}</td>
                <td>{new Date(s.pricedate).toISOString().split('T')[0]}</td>
                <td>{s.close}</td>
                <td>{s.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
