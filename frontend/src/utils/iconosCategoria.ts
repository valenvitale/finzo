import {
  BriefcaseBusiness,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Utensils,
  Car,
  Zap,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconosCategoria = [
  { id: 'briefcase-business', nombre: 'Sueldo', Icono: BriefcaseBusiness },
  { id: 'trending-up', nombre: 'Inversiones', Icono: TrendingUp },
  { id: 'shopping-bag', nombre: 'Ventas', Icono: ShoppingBag },
  { id: 'wallet', nombre: 'Otros ingresos', Icono: Wallet },
  { id: 'utensils', nombre: 'Alimentación', Icono: Utensils },
  { id: 'car', nombre: 'Transporte', Icono: Car },
  { id: 'zap', nombre: 'Servicios', Icono: Zap },
  { id: 'heart-pulse', nombre: 'Salud', Icono: HeartPulse },
  { id: 'graduation-cap', nombre: 'Educación', Icono: GraduationCap },
  { id: 'gamepad-2', nombre: 'Entretenimiento', Icono: Gamepad2 },
  { id: 'tag', nombre: 'Otros gastos', Icono: Tag },
];

export const componentesIcono: Record<string, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'trending-up': TrendingUp,
  'shopping-bag': ShoppingBag,
  wallet: Wallet,
  utensils: Utensils,
  car: Car,
  zap: Zap,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'gamepad-2': Gamepad2,
  tag: Tag,
};
