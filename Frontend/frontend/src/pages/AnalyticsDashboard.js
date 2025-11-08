/**
 * @file AnalyticsDashboard.js
 * @module AnalyticsDashboard
 * @description
 * Interactive analytics dashboard displaying visualized metrics
 * for Customers, Companies, and Stocks. A dropdown lets users choose
 * which analytics subject to view. The selection persists across sessions
 * using localStorage.
 *
 * @requires react
 * @requires recharts
 * @requires ../ApiRequest
 * @requires ./AnalyticsDashboard.css
 */

import { useEffect, useState } from 'react';
import { api } from '../ApiRequest';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import './AnalyticsDashboard.css';

/**
 * @function AnalyticsDashboard
 * @description
 * Renders analytics charts for Customers, Companies, and Stocks.
 * Fetches data from backend API once on mount and displays the chosen
 * dataset based on user selection. Remembers last selected subject in localStorage.
 *
 * @returns {JSX.Element} The rendered analytics dashboard component.
 */
export default function AnalyticsDashboard() {
  /** @member {string} selectedSubject - The analytics subject currently selected by user. */
  const [selectedSubject, setSelectedSubject] = useState(
    localStorage.getItem('selectedSubject') || 'customers'
  );

  /** @member {Array<Object>} avgTenure - Average customer tenure per segment. */
  const [avgTenure, setAvgTenure] = useState([]);

  /** @member {Array<Object>} monthlyJoins - Monthly new customer join counts. */
  const [monthlyJoins, setMonthlyJoins] = useState([]);

  /** @member {Array<Object>} currencyDist - Company currency distribution. */
  const [currencyDist, setCurrencyDist] = useState([]);

  /** @member {Array<Object>} volatility - Stock price range (volatility) per ticker. */
  const [volatility, setVolatility] = useState([]);

  /** @member {Array<string>} COLORS - Color palette for charts. */
  const COLORS = ['#4A6EF5', '#F57C00', '#00BFA5', '#BA68C8', '#43A047'];

  /**
   * @function useEffect
   * @description
   * Fetch analytics data for all domains once when component mounts.
   * Normalizes and coerces numeric fields for Recharts.
   */
  useEffect(() => {
    Promise.all([
      api.get('/customers/avg-tenure'),
      api.get('/customers/monthly-joins'),
      api.get('/companies/currency-distribution'),
      api.get('/stocks/volatility'),
    ])
      .then(([tenure, joins, currency, vol]) => {
        // --- Customers ---
        const fixedTenure = (tenure.rows || tenure).map((t) => ({
          ...t,
          avg_tenure: Number(t.avg_tenure),
        }));
        const fixedJoins = (joins.rows || joins).map((j) => ({
          ...j,
          new_customers: Number(j.new_customers),
        }));
        setAvgTenure(fixedTenure);
        setMonthlyJoins(fixedJoins);

        // --- Companies ---
        const fixedCurrency = (currency.rows || currency)
          .filter((c) => c.currency && c.company_count)
          .map((c) => ({
            currency: String(c.currency).trim(),
            company_count: Number(c.company_count) || 0,
          }));
        setCurrencyDist(fixedCurrency);

        // --- Stocks ---
        const fixedVol = (vol.rows || vol).map((v) => ({
          ...v,
          price_range: Number(v.price_range),
        }));
        setVolatility(fixedVol);
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
        alert('Failed to load analytics data. Please try again later.');
      });
  }, []);

  /**
   * @function handleSubjectChange
   * @description Handles user selection from the dropdown and stores the selection in localStorage.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The dropdown change event.
   */
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSelectedSubject(value);
    localStorage.setItem('selectedSubject', value);
  };

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>

      {/* ===== Dropdown Filter ===== */}
      <div className="dropdown-container">
        <label htmlFor="subject-select">Select Subject:</label>
        <select
          id="subject-select"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="customers">Customers</option>
          <option value="companies">Companies</option>
          <option value="stocks">Stocks</option>
        </select>
      </div>

      {/* ===== CUSTOMERS ===== */}
      {selectedSubject === 'customers' && (
        <section>
          <h2>Customers</h2>

          <h3>Average Tenure by Segment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgTenure}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_tenure" fill="#4A6EF5" />
            </BarChart>
          </ResponsiveContainer>

          <h3>Monthly New Customer Joins</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyJoins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="new_customers"
                stroke="#F57C00"
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* ===== COMPANIES ===== */}
      {selectedSubject === 'companies' && (
        <section>
          <h2>Companies</h2>
          {currencyDist.length === 0 ? (
            <p>Loading currency distribution...</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={currencyDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  dataKey="company_count"
                  nameKey="currency"
                  label={({ currency, company_count }) =>
                    `${currency}: ${company_count}`
                  }
                >
                  {currencyDist.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    props.payload.currency || name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>
      )}

      {/* ===== STOCKS ===== */}
      {selectedSubject === 'stocks' && (
        <section>
          <h2>Stock Volatility</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volatility}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ticker" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="price_range" fill="#BA68C8" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}
