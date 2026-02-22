export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
