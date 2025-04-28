"use client";
import React, { useState, useEffect } from 'react';
import { MetodoPago } from '@/app/models/MetodoPago';
import { metodoPagoService} from '@/app/services/metodoPagoService';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { AlertMessage } from '@/app/components/Alertas/page';
import { AlertaComponent } from '@/app/components/Alertas/AlertaComponent';

export default function MetodoPagoPage() {
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMetodoPago, setCurrentMetodoPago] = useState<Partial<MetodoPago>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetodosPago();
  }, []);

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const loadMetodosPago = async () => {
    setLoading(true);
    try {
      const data = await metodoPagoService.getAllMetodoPago();
      if (Array.isArray(data)) {
        setMetodosPago(data);
      } else {
        console.error('Formato de datos inválido:', data);
        setAlert({
          message: 'Formato de datos inválido recibido del servidor',
          severity: 'error',
          title: 'Error'
        });
      }
    } catch (err) {
      console.error('Error cargando métodos de pago:', err);
      setAlert({
        message: 'Error al cargar los métodos de pago. Por favor, verifica la conexión con el servidor.',
        severity: 'error',
        title: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const metodoPagoData = {
        nombre: currentMetodoPago.nombre || '',
        activo: currentMetodoPago.activo || 0
      };

      if (isEditing && currentMetodoPago.id_metodo_pago) {
        await metodoPagoService.updateMetodoPago(currentMetodoPago.id_metodo_pago, metodoPagoData);
        setAlert({
          message: 'Método de pago actualizado correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      } else {
        await metodoPagoService.createMetodoPago(metodoPagoData);
        setAlert({
          message: 'Método de pago creado correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      }
      loadMetodosPago();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: 'Error al guardar el método de pago',
        severity: 'error',
        title: 'Error'
      });
    }
  };

  const handleEdit = (metodoPago: MetodoPago) => {
    setCurrentMetodoPago(metodoPago);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMetodoPago({});
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este método de pago?')) {
      try {
        await metodoPagoService.deleteMetodoPago(id);
        setAlert({
          message: 'Método de pago eliminado correctamente',
          severity: 'warning',
          title: 'Advertencia'
        });
        loadMetodosPago();
      } catch (err) {
        setAlert({
          message: 'Error al eliminar el método de pago',
          severity: 'error',
          title: 'Error'
        });
      }
    } else {
      setAlert({
        message: 'Eliminación cancelada por el usuario',
        severity: 'info',
        title: 'Información'
      });
    }
  };

  return (
    <div className="container mt-4">
      <AlertaComponent alert={alert} onClose={handleCloseAlert} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Métodos de Pago</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Método de Pago
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {metodosPago.map((metodoPago) => (
              <tr key={metodoPago.id_metodo_pago}>
                <td>{metodoPago.id_metodo_pago}</td>
                <td>{metodoPago.nombre}</td>
                <td>{metodoPago.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(metodoPago)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(metodoPago.id_metodo_pago)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentMetodoPago.nombre || ''}
                onChange={(e) => setCurrentMetodoPago({ ...currentMetodoPago, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="estado-switch"
                label="Estado"
                checked={currentMetodoPago.activo === 1}
                onChange={(e) => setCurrentMetodoPago({ 
                  ...currentMetodoPago, 
                  activo: e.target.checked ? 1 : 0 
                })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}