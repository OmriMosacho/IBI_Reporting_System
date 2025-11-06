import { useState, useEffect } from 'react';
import axios from 'axios';
import './Table.css';

export default function CompaniesTable({ token }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/companies', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      setCompanies(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p>Loading companies...</p>;

  return (
    <div>
      <h2>Companies Overview</h2>
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
          {companies.map((c) => (
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
    </div>
  );
}
