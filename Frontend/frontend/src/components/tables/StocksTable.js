import { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

export default function StocksTable({ token }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/stocks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setStocks(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Loading stock prices...</p>;

  return (
    <div>
      <h2>Stock Prices</h2>
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
          {stocks.map((s, i) => (
            <tr key={`${s.ticker}-${i}`}>
              <td>{s.ticker}</td>
              <td>{new Date(s.pricedate).toISOString().split('T')[0]}</td>
              <td>{s.close}</td>
              <td>{s.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
