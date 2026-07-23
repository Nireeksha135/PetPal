import { Link } from "react-router-dom";
import { LayoutDashboard, PawPrint, Pill, Syringe, ShieldPlus, Bug, FileText, Bot, MessageCircle, Salad } from "lucide-react";
import Button from "@/components/Button";

const quickLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Pets", path: "/pets", icon: PawPrint },
  { label: "Medicine", path: "/medicine", icon: Pill },
  { label: "Vaccinations", path: "/vaccinations", icon: Syringe },
  { label: "Deworming", path: "/deworming", icon: ShieldPlus },
  { label: "Flea & Tick", path: "/flea-tick", icon: Bug },
  { label: "Documents", path: "/documents", icon: FileText },
  { label: "AI Pet Doctor", path: "/ai-pet-doctor", icon: Bot },
  { label: "Ask PetPal", path: "/ask-petpal", icon: MessageCircle },
  { label: "Diet Assistant", path: "/diet-assistant", icon: Salad },
];

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-6xl space-y-10">
        <section className="rounded-3xl bg-card p-10 shadow-xl shadow-black/5">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Welcome back</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                PetPal is ready to go.
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground">
                Use the dashboard to manage pets, medication, vaccinations, records, and AI services from one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button size="md">Open Dashboard</Button>
              </Link>
              <Link to="/pets/new">
                <Button variant="secondary" size="md">Add a Pet</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path} className="group">
              <Button
                variant="secondary"
                className="w-full justify-start overflow-hidden text-left"
              >
                <item.icon size={18} className="mr-3 text-primary" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-card p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Why PetPal?</h2>
            <p className="text-muted-foreground">
              PetPal helps you keep every pet record in one place so you can stay on top of medicines, appointments, and preventive care.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">Quick start</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Create a pet profile</li>
              <li>• Add medicine and vaccination records</li>
              <li>• Track deworming and flea/tick treatments</li>
              <li>• Use AI tools for dietary guidance and symptom checks</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
