"use client";
import React, { useState, useEffect } from 'react';
import { Categoria } from '@/app/models/Categoria';
import { categoriaService } from '@/app/services/categoriaService';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Partial<Categoria>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.getAllCategorias();
      if (Array.isArray(data)) {
        setCategorias(data);
        setError(null);
      } else {
        console.error('Formato de datos inválido:', data);
        setError('Formato de datos inválido recibido del servidor');
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías. Por favor, verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoriaData = {
        nombre: currentCategoria.nombre || '',
        descripcion: currentCategoria.descripcion || null
      };

      if (isEditing && currentCategoria.id_categoria) {
        await categoriaService.updateCategoria(currentCategoria.id_categoria, categoriaData);
      } else {
        await categoriaService.createCategoria(categoriaData);
      }
      loadCategorias();
      handleCloseModal();
    } catch (err) {
      setError('Error al guardar la categoría');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setCurrentCategoria(categoria);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategoria({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await categoriaService.deleteCategoria(id);
        loadCategorias();
      } catch (err) {
        setError('Error al eliminar la categoría');
      }
    }
  };

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Categorías</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nueva Categoría
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
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.id_categoria}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(categoria)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(categoria.id_categoria)}
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
          <Modal.Title>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentCategoria.nombre || ''}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentCategoria.descripcion || ''}
                onChange={(e) => setCurrentCategoria({ ...currentCategoria, descripcion: e.target.value })}
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