export default function DashboardCard({ title, value, bgColor, textColor }) {
  return (
    <div
      className={`rounded-lg shadow-lg transform transition-transform hover:scale-105 p-8 ${bgColor} ${textColor} border border-solid border-gray-300`}
    >
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
