export interface ApiResponse<T> {
  exito: boolean;
  datos: T;
  mensaje?: string;
}

export interface Paginacion<T> {
  datos: T[];
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}
