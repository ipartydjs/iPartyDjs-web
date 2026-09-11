import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateSolicitudInput } from "@ipartydjs/shared";
import { SolicitudForm } from "@/features/solicitudes/components/SolicitudForm";
import { useCrearSolicitud } from "@/features/solicitudes/hooks/useSolicitudes";
import Overline from "@/shared/ui/Overline";

export default function CrearSolicitud() {
    const crear = useCrearSolicitud();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = (data: CreateSolicitudInput) => {
        setErrorMsg(null);
        crear.mutate(data, {
            onSuccess: () => {
                navigate("/dashboard/solicitudes");
            },
            onError: (error) => {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : "No se pudo crear la solicitud.",
                );
            },
        });
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <Overline children={"Solicita tu nueva experiencia"} />
                </div>
                <h1 className="font-display text-3xl font-normal text-balance text-cream sm:text-5xl">
                    Solicita tu proximo evento
                </h1>
            </div>

            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <SolicitudForm
                mode="crear"
                onSubmit={handleSubmit}
                isLoading={crear.isPending}
            />
        </div>
    );
}
