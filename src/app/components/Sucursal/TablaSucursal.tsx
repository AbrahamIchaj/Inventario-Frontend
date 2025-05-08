import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Sucursal } from '@/app/models/Sucursal';

interface TablaSucursalProps {
  sucursales: Sucursal[];
  loading: boolean;
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (id: number) => void;
}

export const TablaSucursal: React.FC<TablaSucursalProps> = ({
  sucursales,
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
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Responsable</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {sucursales.map((sucursal) => (
          <tr key={sucursal.id_sucursal}>
            <td>{sucursal.id_sucursal}</td>
            <td>{sucursal.nombre}</td>
            <td>{sucursal.direccion}</td>
            <td>{sucursal.telefono}</td>
            <td>
              {sucursal.responsable ? sucursal.responsable.nombre : 'Cargando...'}
            </td>
            <td>
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => onEdit(sucursal)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(sucursal.id_sucursal)}
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