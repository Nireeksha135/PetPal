export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="rounded-2xl bg-card p-10 shadow-card">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to PetPal
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Project foundation is up and running. Authentication and the
          dashboard are coming up next.
        </p>
      </div>
    </div>
  );
}
