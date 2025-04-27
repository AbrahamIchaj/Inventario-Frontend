"use client";
import React, { useState, useEffect } from "react";
import { Impuesto } from "@/app/models/Impuesto";
import { impuestoService } from "@/app/services/impuestoService";
import { Button, Table, Modal, Form, Alert } from "react-bootstrap";
import { AlertMessage } from "@/app/components/Alertas/page";
import { AlertaComponent } from "@/app/components/Alertas/AlertaComponent";

export default function ImpuestosPage() {
  const [impuestos, setImpuestos] = useState<Impuesto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentImpuesto, setCurrentImpuesto] = useState<Partial<Impuesto>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);

  useEffect(() => {
    loadImpuestos();
  }, []);

  const loadImpuestos = async () => {
    setLoading(true);
    try {
      const data = await impuestoService.getAllImpuestos();
      if (Array.isArray(data)) {
        setImpuestos(data);
        setError(null);
      } else {
        setAlert({
          message: "Formato de datos inválido recibido del servidor",
          severity: "error",
          title: "Error",
        });
      }
    } catch (err) {
      setAlert({
        message:
          "Error al cargar las Impuesto. Por favor, verifica la conexión con el servidor.",
        severity: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const impuestoData = {
        nombre: currentImpuesto.nombre || "",
        porcentaje: currentImpuesto.porcentaje || 0,
        descripcion: currentImpuesto.descripcion || null,
      };

      if (isEditing && currentImpuesto.id_impuesto) {
        await impuestoService.updateImpuesto(
          currentImpuesto.id_impuesto,
          impuestoData
        );
        setAlert({
          message: "Impuesto actualizado correctamente",
          severity: "success",
          title: "Éxito",
        });
      } else {
        await impuestoService.createImpuesto(impuestoData);
        setAlert({
          message: "Impuesto creado correctamente",
          severity: "success",
          title: "Éxito",
        });
      }
      loadImpuestos();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: "Error al guardar Impuesto",
        severity: "error",
        title: "Error",
      });
    }
  };

  const handleEdit = (impuesto: Impuesto) => {
    setCurrentImpuesto(impuesto);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentImpuesto({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este impuesto?")) {
      try {
        await impuestoService.deleteImpuesto(id);
        setAlert({
          message: "Impuesto eliminado correctamente",
          severity: "warning",
          title: "Advertencia",
        });
        loadImpuestos();
      } catch (err) {
        setAlert({
          message: "Error al eliminar la Impuesto",
          severity: "error",
          title: "Error",
        });
      }
    } else {
      setAlert({
        message: "Eliminación cancelada por el usuario",
        severity: "info",
        title: "Información",
      });
    }
  };

  return (
    <div className="container mt-4">
      <AlertaComponent alert={alert} onClose={handleCloseAlert} />

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Impuestos</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nuevo Impuesto
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
              <th>Porcentaje</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {impuestos.map((impuesto) => (
              <tr key={impuesto.id_impuesto}>
                <td>{impuesto.id_impuesto}</td>
                <td>{impuesto.nombre}</td>
                <td>{impuesto.porcentaje}%</td>
                <td>{impuesto.descripcion}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(impuesto)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(impuesto.id_impuesto)}
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
            {isEditing ? "Editar Impuesto" : "Nuevo Impuesto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentImpuesto.nombre || ""}
                onChange={(e) =>
                  setCurrentImpuesto({
                    ...currentImpuesto,
                    nombre: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Porcentaje</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={currentImpuesto.porcentaje || ""}
                onChange={(e) =>
                  setCurrentImpuesto({
                    ...currentImpuesto,
                    porcentaje: parseFloat(e.target.value),
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentImpuesto.descripcion || ""}
                onChange={(e) =>
                  setCurrentImpuesto({
                    ...currentImpuesto,
                    descripcion: e.target.value,
                  })
                }
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
