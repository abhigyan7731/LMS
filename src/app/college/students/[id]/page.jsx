export default function StudentDetailPage({ params }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Student Profile</h1>
      <p className="text-muted-foreground mt-2">
        Viewing student: {params.id}
      </p>
    </div>
  );
}
