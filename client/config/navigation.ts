import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PawPrint,
  Pill,
  Syringe,
  Bug,
  ShieldPlus,
  Stethoscope,
  FileText,
  Images,
  Bot,
  MessageCircle,
  Salad,
  Sparkles,
  Bell,
  BarChart3,
  Search,
  Settings,
} from "lucide-react";

export interface NavItemConfig {
  label: string;
  path: string;
  icon: LucideIcon;
  enabled: boolean;
}

export interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export const navigation: NavGroupConfig[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, enabled: true },
      { label: "My Pets", path: "/pets", icon: PawPrint, enabled: false },
    ],
  },
  {
    title: "Health Tracking",
    items: [
      { label: "Medicine", path: "/medicine", icon: Pill, enabled: false },
      { label: "Vaccinations", path: "/vaccinations", icon: Syringe, enabled: false },
      { label: "Deworming", path: "/deworming", icon: ShieldPlus, enabled: false },
      { label: "Flea & Tick", path: "/flea-tick", icon: Bug, enabled: false },
      { label: "Vet Visits", path: "/vet-visits", icon: Stethoscope, enabled: false },
      { label: "Documents", path: "/documents", icon: FileText, enabled: false },
    ],
  },
  {
    title: "Memories",
    items: [
      { label: "Gallery", path: "/gallery", icon: Images, enabled: false },
    ],
  },
  {
    title: "AI Assistant",
    items: [
      { label: "AI Pet Doctor", path: "/ai-pet-doctor", icon: Bot, enabled: false },
      { label: "Ask PetPal", path: "/ask-petpal", icon: MessageCircle, enabled: false },
      { label: "Diet Assistant", path: "/diet-assistant", icon: Salad, enabled: false },
      { label: "Daily Summary", path: "/daily-summary", icon: Sparkles, enabled: false },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Notifications", path: "/notifications", icon: Bell, enabled: false },
      { label: "Analytics", path: "/analytics", icon: BarChart3, enabled: false },
      { label: "Search", path: "/search", icon: Search, enabled: false },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Settings", path: "/settings", icon: Settings, enabled: false },
    ],
  },
];

export function findNavItemByPath(pathname: string): NavItemConfig | undefined {
  for (const group of navigation) {
    const match = group.items.find((item) => pathname.startsWith(item.path));
    if (match) return match;
  }
  return undefined;
}
