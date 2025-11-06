import { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

export default function CustomersTable({ token }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/customers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setCustomers(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Loading customers...</p>;

  return (
    <div>
      <h2>Customers Overview</h2>
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
          {customers.map((c) => (
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
    </div>
  );
}
