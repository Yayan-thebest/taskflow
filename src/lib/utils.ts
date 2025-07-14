import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateInviteCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result;
};


// Retourne les 2 premières lettres en majuscules
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join("");
}
// Retourne une couleur Tailwind basée sur le nom
export function getColorFromName(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  // Simple hash : somme des codes de caractères
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};

export function snakeCaseToTitleCase(str: string) {
  return str.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
