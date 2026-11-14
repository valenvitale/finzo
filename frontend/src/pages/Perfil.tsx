import GestionMediosPago from '../components/medios-pago/GestionMediosPago';

export default function Perfil() {
  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-oliva sm:text-3xl">Perfil</h1>
        <p className="text-sm text-slate-500">Administrá tus medios de pago y personalizá cómo registrás tus movimientos.</p>
      </header>
      <GestionMediosPago />
    </div>
  );
}
