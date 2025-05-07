export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol_id: number;
  activo: boolean;
  ultimo_acceso: Date | null;
  rol?: {
    id_rol: number;
    nombre: string;
    permisos: string;
  };
}
