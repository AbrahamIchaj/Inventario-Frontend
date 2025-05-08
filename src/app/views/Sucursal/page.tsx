"use client";
import React, { useState, useEffect } from "react";
import { Sucursal } from "@/app/models/Sucursal";
import { sucursalService } from "@/app/services/sucursalService";
import { usuarioService } from "@/app/services/usuarioService";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { AlertMessage } from "@/app/components/Alertas/page";
import { AlertaComponent } from "@/app/components/Alertas/AlertaComponent";
import { TablaSucursal } from "@/app/components/Sucursal/TablaSucursal";

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSucursal, setCurrentSucursal] = useState<Partial<Sucursal>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const handleCloseAlert = () => setAlert(null);
  const [responsables, setResponsables] = useState<any[]>([]);

  useEffect(() => {
    loadSucursales();
    loadResponsables();
  }, []);

  const loadSucursales = async () => {
    setLoading(true);
    try {
      const data = await sucursalService.getAllSucursales();
      if (Array.isArray(data)) {
        const sucursalesConResponsables = await Promise.all(data.map(async (sucursal) => {
          try {
            const responsable = await usuarioService.getUsuarioById(sucursal.responsable_id);
            return {
              ...sucursal,
              responsable: {
                id_usuario: responsable.id_usuario,
                nombre: responsable.nombre,
                email: responsable.email
              }
            };
          } catch (error) {
            return sucursal;
          }
        }));
        
        setSucursales(sucursalesConResponsables);
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
          "Error al cargar las sucursales. Por favor, verifica la conexión con el servidor.",
        severity: "error",
        title: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadResponsables = async () => {
    try {
      const data = await usuarioService.getAllUsuarios();
      if (Array.isArray(data)) {
        setResponsables(data);
      }
    } catch (err) {
      console.error('Error cargando responsables:', err);
    }
  };

  const validateSucursal = (
    sucursal: Partial<Sucursal>
  ): { isValid: boolean; message: string } => {
    if (!sucursal.nombre?.trim())
      return { isValid: false, message: "El nombre es requerido" };
    if (!sucursal.direccion?.trim())
      return { isValid: false, message: "La dirección es requerida" };
    if (!sucursal.telefono?.trim())
      return { isValid: false, message: "El teléfono es requerido" };
    if (!sucursal.responsable_id)
      return { isValid: false, message: "El responsable es requerido" };

    return { isValid: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSucursal(currentSucursal);
    if (!validation.isValid) {
      setAlert({
        message: validation.message,
        severity: "error",
        title: "Error de Validación",
      });
      return;
    }

    try {
      const sucursalData = {
        nombre: currentSucursal.nombre!,
        direccion: currentSucursal.direccion!,
        telefono: currentSucursal.telefono!,
        responsable_id: currentSucursal.responsable_id!,
      };

      if (isEditing && currentSucursal.id_sucursal) {
        await sucursalService.updateSucursal(
          currentSucursal.id_sucursal,
          sucursalData
        );
        setAlert({
          message: "Sucursal actualizada correctamente",
          severity: "success",
          title: "Éxito",
        });
      } else {
        await sucursalService.createSucursal(sucursalData);
        setAlert({
          message: "Sucursal creada correctamente",
          severity: "success",
          title: "Éxito",
        });
      }
      loadSucursales();
      handleCloseModal();
    } catch (err) {
      setAlert({
        message: "Error al guardar sucursal",
        severity: "error",
        title: "Error",
      });
    }
  };

  const handleEdit = (sucursal: Sucursal) => {
    setCurrentSucursal(sucursal);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSucursal({});
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta sucursal?")) {
      try {
        await sucursalService.deleteSucursal(id);
        setAlert({
          message: "Sucursal eliminada correctamente",
          severity: "warning",
          title: "Advertencia",
        });
        loadSucursales();
      } catch (err) {
        setAlert({
          message: "Error al eliminar la sucursal",
          severity: "error",
          title: "Error",
        });
      }
    }
  };

  return (
    <div className="container mt-4">
      <AlertaComponent alert={alert} onClose={handleCloseAlert} />
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sucursales</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Nueva Sucursal
        </Button>
      </div>

      <TablaSucursal
        sucursales={sucursales}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={currentSucursal.nombre || ""}
                onChange={(e) =>
                  setCurrentSucursal({
                    ...currentSucursal,
                    nombre: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={currentSucursal.direccion || ""}
                onChange={(e) =>
                  setCurrentSucursal({
                    ...currentSucursal,
                    direccion: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={currentSucursal.telefono || ""}
                onChange={(e) =>
                  setCurrentSucursal({
                    ...currentSucursal,
                    telefono: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Responsable</Form.Label>
              <Form.Select
                value={currentSucursal.responsable_id || ""}
                onChange={(e) =>
                  setCurrentSucursal({
                    ...currentSucursal,
                    responsable_id: Number(e.target.value),
                  })
                }
                required
              >
                <option value="">Seleccione un responsable</option>
                {responsables.map((responsable) => (
                  <option key={responsable.id_usuario} value={responsable.id_usuario}>
                    {responsable.nombre}
                  </option>
                ))}
              </Form.Select>
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