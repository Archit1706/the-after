import {
  Building2,
  FolderLock,
  ListChecks,
  PenLine,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/plan", label: "Your plan", icon: ListChecks },
  { href: "/letters", label: "Letters & scripts", icon: PenLine },
  { href: "/documents", label: "Document vault", icon: FolderLock },
  { href: "/directory", label: "Who to notify", icon: Building2 },
  { href: "/companion", label: "Companion", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];
