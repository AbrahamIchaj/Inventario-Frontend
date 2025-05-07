import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Usuario } from '@/app/models/Usuario';

interface TablaUsuarioProps {
  usuarios: Usuario[];
  loading: boolean;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

export const TablaUsuario: React.FC<TablaUsuarioProps> = ({
  usuarios,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Último Acceso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id_usuario}>
            <td>{usuario.id_usuario}</td>
            <td>{usuario.nombre}</td>
            <td>{usuario.email}</td>
            <td>{usuario.rol?.nombre || 'Sin rol'}</td>
            <td>
              <Badge bg={usuario.activo ? 'success' : 'danger'}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </td>
            <td>
              {usuario.ultimo_acceso 
                ? new Date(usuario.ultimo_acceso).toLocaleString()
                : 'Nunca'}
            </td>
            <td>
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => onEdit(usuario)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(usuario.id_usuario)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};