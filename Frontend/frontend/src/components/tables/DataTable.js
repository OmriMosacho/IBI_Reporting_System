/**
 * @file DataTable.js
 * @module DataTable
 * @description
 * A reusable React component that dynamically fetches and displays tabular data
 * from the backend using the ApiRequest module. Supports row counting, collapsible view,
 * incremental data loading, and loading/error states.
 */

import { useState, useEffect } from 'react';
import { api } from '../../ApiRequest';
import './Table.css';

/**
 * @function DataTable
 * @description
 * Generic data table component for displaying data from any backend table.
 * @param {Object} props - The component properties.
 * @param {string} props.tableName - Name of the table to fetch from the backend.
 * @param {string} props.title - The title displayed above the table.
 * @param {string[]} props.columns - The column keys to display.
 * @param {string} [props.token] - Optional JWT token for authenticated requests.
 * @returns {JSX.Element} Rendered DataTable component.
 */
export default function DataTable({ tableName, title, columns, token }) {
  /** @member {Array} data - All fetched rows from the backend. */
  const [data, setData] = useState([]);
  /** @member {number} visibleCount - Number of rows currently shown. */
  const [visibleCount, setVisibleCount] = useState(100);
  /** @member {boolean} loading - Loading state for data fetching. */
  const [loading, setLoading] = useState(true);
  /** @member {string|null} error - Error message if fetch fails. */
  const [error, setError] = useState(null);
  /** @member {boolean} collapsed - Whether the table is hidden or visible. */
  const [collapsed, setCollapsed] = useState(false);

  /**
   * @function useEffect
   * @description Fetch data from the backend when the component mounts or dependencies change.
   */
  useEffect(() => {
    setLoading(true);
    api.get('fetch_table', { tableName })
      .then((res) => setData(res.rows || []))
      .catch((err) => {
        console.error(err);
        alert(`Failed to load ${title.toLowerCase()}. Please try again later.`);
        setError(`Failed to load ${title.toLowerCase()}`);
      })
      .finally(() => setLoading(false));
  }, [tableName, token, title]);

  if (loading) return <p>Loading {title.toLowerCase()}...</p>;
  if (error) return <p className="error">{error}</p>;

  const total = data.length;
  const visibleData = data.slice(0, visibleCount);

  /**
   * @function handleLoadMore
   * @description Increases the number of visible rows by 100 each click.
   */
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 100, total));
  };

  return (
    <div className="table-section">
      <div className="table-header">
        <h2>{title} ({total} Rows)</h2>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? 'Show Table' : 'Hide Table'}
        </button>
      </div>

      {!collapsed && (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{formatCellValue(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCount < total && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Load More ({Math.min(visibleCount + 100, total)} / {total})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * @function formatCellValue
 * @description Formats raw database values for display (e.g., dates).
 * @param {*} value - The raw value from the database.
 * @returns {string} A human-readable formatted string.
 */
function formatCellValue(value) {
  if (!value) return '';
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    try {
      return new Date(value).toISOString().split('T')[0];
    } catch {
      return value;
    }
  }
  return value;
}
