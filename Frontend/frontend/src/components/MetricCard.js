import './MetricCard.css';

export default function MetricCard({ title, value, color }) {
  return (
    <div className="metric-card" style={{ borderTop: `4px solid ${color}` }}>
      <h3>{title}</h3>
      <p className="metric-value">{value}</p>
    </div>
  );
}
