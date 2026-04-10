// Define una respuesta genérica para reutilizar en los controladores.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
