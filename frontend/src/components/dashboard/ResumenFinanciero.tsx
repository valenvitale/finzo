import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { TarjetaMetrica } from './TarjetaMetrica';
import { formatearMonto } from '../../utils/formateadores';

interface ResumenFinancieroProps {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  moneda: string;
}

export function ResumenFinanciero({
  totalIngresos,
  totalGastos,
  balance,
  moneda
}: ResumenFinancieroProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TarjetaMetrica
        titulo="Ingresos"
        valor={formatearMonto(totalIngresos, moneda)}
        icono={<TrendingUp size={24} />}
        color="verde"
      />

      <TarjetaMetrica
        titulo="Gastos"
        valor={formatearMonto(totalGastos, moneda)}
        icono={<TrendingDown size={24} />}
        color="rojo"
      />

      <TarjetaMetrica
        titulo="Balance Neto"
        valor={formatearMonto(balance, moneda)}
        icono={<Wallet size={24} />}
        color={balance >= 0 ? 'verde' : 'rojo'}
      />
    </div>
  );
}
