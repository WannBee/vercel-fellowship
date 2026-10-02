const colors = {
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
};
export default function StatCard({ title, count, icon: Icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 capitalize">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{count}</h3>
        </div>
        <div
          className={`p-3 rounded-xl border ${colors[color] || colors.indigo}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
