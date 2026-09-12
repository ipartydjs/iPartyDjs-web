import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
    EstadoSolicitud,
    SolicitudEventoDTO,
    TipoEvento,
} from "@ipartydjs/shared";
import { useMisSolicitudes } from "@/features/solicitudes/hooks/useSolicitudes";
import EditarSolicitud from "./EditarSolicitud";
import { ButtonNavigate } from "@/shared/ui";
import Filters from "@/shared/ui/Filters";
import { TextCard } from "@/shared/ui/TextCard";

const ESTADO_OPTIONS: EstadoSolicitud[] = [
    "pendiente",
    "en_proceso",
    "completada",
    "rechazada",
];

const STATUS_COLOR: Record<EstadoSolicitud, string> = {
    completada: "bg-emerald-500/12 text-emerald-300 border border-emerald-300",
    pendiente: "bg-gold/12 text-gold border border-gold",
    rechazada: "bg-danger/12 text-danger border border-danger",
    en_proceso: "bg-violet-500/12 text-violet-300 border border-violet-300",
};

const TIPO_EVENTO_VIEW: Record<TipoEvento, string> = {
    boda: "Boda",
    xv_anos: "XV Años",
    corporativo: "Corporativo",
    cumpleanos: "Cumpleaños",
    otro: "Otro",
};

const STATUS_LABEL: Record<EstadoSolicitud, string> = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completada: "Completado",
    rechazada: "Rechazado",
};

function formatDia(iso: string): string {
    return new Date(iso).toLocaleDateString("es-MX", { day: "2-digit" });
}

function formatMes(iso: string): string {
    const mes = new Date(iso).toLocaleDateString("es-MX", { month: "short" });
    return mes.charAt(0).toUpperCase() + mes.slice(1).replace(".", "");
}

function formatHora(iso: string): string {
    return new Date(iso).toLocaleTimeString("es-MX", {
        hour: "numeric",
        minute: "2-digit",
    });
}

const CardSolicitud = (params: SolicitudEventoDTO, onClick?: () => void) => {
    return (
        <TextCard title={params.id_solicitud}>
            <div className="flex flex-col md:flex-row">
                <div className="hidden md:flex items-center justify-center w-16 text-center p-3 flex-col">
                    <span className="text-xl font-semibold text-cream">
                        {formatDia(params.fecha_deseada)}
                    </span>

                    <span className="text-xs text-cream-dim uppercase">
                        {formatMes(params.fecha_deseada)}
                    </span>
                </div>

                <div className="hidden md:block w-1 bg-gold" />

                <div className="flex-1 grid p-4">
                    <div className="text-base font-medium text-cream">
                        {TIPO_EVENTO_VIEW[params.tipo_evento]}
                    </div>

                    {/* Móvil */}
                    <div className="md:hidden text-sm text-cream-dim my-1">
                        <span>
                            {formatDia(params.fecha_deseada)}{" "}
                            {formatMes(params.fecha_deseada)}
                        </span>
                        <span className="mx-1">·</span>
                        <span>{formatHora(params.fecha_deseada)}</span>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block text-sm text-cream-dim my-1">
                        {formatHora(params.fecha_deseada)}
                    </div>

                    <div className="mt-4 text-sm text-cream-dim my-1">
                        {params.direccion}
                    </div>
                    <div className="text-sm text-cream-dim my-1">
                        Enviada el{" "}
                        <span>
                            {formatDia(params.created_at)}{" "}
                            {formatMes(params.created_at)}
                        </span>
                        <span className="mx-1">·</span>
                        <span>{formatHora(params.created_at)}</span>
                    </div>
                </div>
                <div className="flex flex-col h-full justify-between">
                    <span
                        className={`text-center px-3 py-1 m-3 w-full text-xs font-medium h-min ${STATUS_COLOR[params.estado]}`}
                    >
                        {STATUS_LABEL[params.estado]}
                    </span>
                    {onClick ? (
                        <ButtonNavigate className="w-full" onClick={onClick}>
                            Editar detalles
                        </ButtonNavigate>
                    ) : null}
                </div>
            </div>
        </TextCard>
    );
};

export default function MisSolicitudes() {
    const [estado, setEstado] = useState<EstadoSolicitud | undefined>(
        undefined,
    );
    const [selectedSolicitudId, setSelectedSolicitudId] = useState<
        string | null
    >(null);
    const {
        data: solicitudes,
        isLoading,
        isError,
        error,
    } = useMisSolicitudes(estado);
    // We now render EditarSolicitud directly inside the modal via idProp
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-3xl">
            <header className="text-center place-content-between flex flex-row">
                <h1 className="font-display text-3xl font-normal text-balance text-cream sm:text-5xl">
                    Mis solicitudes
                </h1>
                <ButtonNavigate
                    onClick={() => navigate("/dashboard/solicitudes/nueva")}
                >
                    Nueva solicitud
                </ButtonNavigate>
            </header>
            <p className="mt-4 text-sm text-pretty text-cream-dim sm:text-base">
                Ve el estato de tus solicitudes para revisar tu proximo evento
            </p>
            <Filters
                filters={["Todos", ...ESTADO_OPTIONS]}
                value={(estado ?? "Todos") as string}
                onChange={(v: string) =>
                    setEstado(
                        v === "Todos" ? undefined : (v as EstadoSolicitud),
                    )
                }
                className="mt-6 mb-6"
            />

            {isLoading && (
                <p className="mt-4 text-sm text-pretty text-cream-dim sm:text-base">
                    Cargando solicitudes ...
                </p>
            )}
            {isError && (
                <div className="flex items-center justify-center py-24">
                    <p className="font-body text-sm text-danger">
                        {error instanceof Error
                            ? error.message
                            : "Error al cargar solicitudes"}
                    </p>
                </div>
            )}

            <div className="text-sm font-semibold text-gray-400 uppercase mt-8 mb-3">
                Solicitudes ({solicitudes?.length})
            </div>

            <div className="space-y-4">
                {solicitudes?.map((s) =>
                    CardSolicitud(
                        s,
                        s.estado == "pendiente"
                            ? () => setSelectedSolicitudId(s.id_solicitud)
                            : undefined,
                    ),
                )}
            </div>

            {selectedSolicitudId && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedSolicitudId(null)}
                >
                    <div
                        className="bg-surface w-full max-w-2xl rounded-lg shadow-lg p-8 mx-4"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Editar solicitud"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">
                                Editar solicitud
                            </h2>
                            <button
                                type="button"
                                className="text-2xl leading-none p-1 rounded hover:bg-gray-200/10"
                                onClick={() => setSelectedSolicitudId(null)}
                                aria-label="Cerrar modal"
                            >
                                ×
                            </button>
                        </div>

                        <EditarSolicitud
                            idProp={selectedSolicitudId}
                            hideHeader
                            onClose={() => setSelectedSolicitudId(null)}
                        />
                    </div>
                </div>
            )}

            {solicitudes?.length === 0 && !isLoading && (
                <p className="mt-4 text-sm text-pretty text-cream-dim sm:text-base">
                    No tienes solicitudes registradas.
                </p>
            )}
        </div>
    );
}
