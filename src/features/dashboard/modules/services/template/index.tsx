"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { ServiceFormModal, ServicesTable, DeleteServiceModal } from "../components";
import { IServicesItems } from "../interfaces";

export const ServicesTemplate = () => {
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<IServicesItems | null>(null);

    const [listRefreshKey, setListRefreshKey] = useState(0);
    const [deleteServiceModalOpen, setDeleteServiceModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<IServicesItems | null>(null);

    const refreshServicesList = () => {
        setListRefreshKey((key) => key + 1);
    };

    const openCreateModal = () => {
        setSelectedService(null);
        setServiceModalOpen(true);
    };

    const openEditModal = (service: IServicesItems) => {
        setSelectedService(service);
        setServiceModalOpen(true);
    };

    const handleModalOpenChange = (next: boolean) => {
        setServiceModalOpen(next);
        if (!next) setSelectedService(null);
    };

    const openDeleteModal = (service: IServicesItems) => {
        setServiceToDelete(service);
        setDeleteServiceModalOpen(true);
    };

    const handleDeleteModalOpenChange = (next: boolean) => {
        setDeleteServiceModalOpen(next);
        if (!next) setServiceToDelete(null);
    };

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-ink-50">
                        Servicios
                    </h1>
                    <p className="text-sm text-ink-300">
                        Gestión de servicios
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <PlusIcon className="h-4 w-4" />
                    Agregar Servicio
                </Button>
            </section>
            <ServicesTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                refreshKey={listRefreshKey}
            />
            <ServiceFormModal
                open={serviceModalOpen}
                onOpenChange={handleModalOpenChange}
                service={selectedService}
                onSuccess={refreshServicesList}
            />
            <DeleteServiceModal
                open={deleteServiceModalOpen}
                onOpenChange={handleDeleteModalOpenChange}
                service={serviceToDelete}
                onSuccess={refreshServicesList}
            />
        </>
    );
};
