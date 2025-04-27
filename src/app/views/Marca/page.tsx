"use client";
import React, { useState, useEffect } from 'react';
import { Marca } from '@/app/models/Marca';
import { marcaService } from '@/app/services/marcaService';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { AlertMessage } from '@/app/components/Alertas/page';
import { AlertaComponent } from '@/app/components/Alertas/AlertaComponent';

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMarca, setCurrentMarca] = useState<Partial<Marca>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarcas();
  }, []);

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const loadMarcas = async () => {
    setLoading(true);
    try {
      const data = await marcaService.getAllMarca();
      if (Array.isArray(data)) {
        setMarcas(data);
      } else {
        console.error('Formato de datos inválido:', data);
        setAlert({
          message: 'Formato de datos inválido recibido del servidor',
          severity: 'error',
          title: 'Error'
        });
      }
    } catch (err) {
      console.error('Error cargando marcas:', err);
      setAlert({
        message: 'Error al cargar las marcas. Por favor, verifica la conexión con el servidor.',
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
      const marcaData = {
        nombre: currentMarca.nombre || '',
        descripcion: currentMarca.descripcion || null
      };

      if (isEditing && currentMarca.id_marca) {
        await marcaService.updateMarca(currentMarca.id_marca, marcaData);
        setAlert({
          message: 'Marca actualizada correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      } else {
        await marcaService.createMarca(marcaData);
        setAlert({
          message: 'Marca creada correctamente',
          severity: 'success',
          title: 'Éxito'
        });
      }
      loadMarcas();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: 'Error al guardar la marca',
        severity: 'error',
        title: 'Error'
      });
    }
  };

  const handleEdit = (marca: Marca) => {
    setCurrentMarca(marca);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMarca({});
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta marca?')) {
      try {
        await marcaService.deleteMarca(id);
        setAlert({
          message: 'Marca eliminada correctamente',
          severity: 'warning',
          title: 'Advertencia'
        });
        loadMarcas();
      } catch (err) {
        setAlert({
          message: 'Error al eliminar la marca',
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
        <h2>Marcas</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nueva Marca
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
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca) => (
              <tr key={marca.id_marca}>
                <td>{marca.id_marca}</td>
                <td>{marca.nombre}</td>
                <td>{marca.descripcion}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(marca)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(marca.id_marca)}
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
          <Modal.Title>{isEditing ? 'Editar Marca' : 'Nueva Marca'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentMarca.nombre || ''}
                onChange={(e) => setCurrentMarca({ ...currentMarca, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentMarca.descripcion || ''}
                onChange={(e) => setCurrentMarca({ ...currentMarca, descripcion: e.target.value })}
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