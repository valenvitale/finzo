export interface MonedaResponseDTO {
  id: string;
  nombre: string;
  codigo: string;
  simbolo: string;
}

export interface MonedaPerfilResponseDTO extends MonedaResponseDTO {
  esPrincipal: boolean;
}

export interface AsignarMonedaDTO {
  monedaId: string;
  esPrincipal?: boolean;
}
