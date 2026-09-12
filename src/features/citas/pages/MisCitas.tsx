import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import type { CitaDTO } from "@ipartydjs/shared";
import { useMisSolicitudes } from "@/features/solicitudes/hooks/useSolicitudes";
import { citaService } from "@/features/citas/services/cita.service";
import Filters from "@/shared/ui/Filters";
import { TextCard } from "@/shared/ui/TextCard";
import { Button } from "@/shared/ui";

type FilterType = "Todas" | "Programadas" | "Realizadas" | "Canceladas";

interface CitaEnriquecida extends CitaDTO {
    tituloSolicitud: string;
}

const FILTERS: FilterType[] = [
    "Todas",
    "Programadas",
    "Realizadas",
    "Canceladas",
];

const STATUS_LABEL: Record<CitaDTO["estado"], string> = {
    programada: "Programada",
    realizada: "Realizada",
    cancelada: "Cancelada",
};

const TIPO_EVENTO_LABEL: Record<string, string> = {
    boda: "Boda",
    xv_anos: "XV años",
    cumpleanos: "Cumpleaños",
    corporativo: "Corporativo",
    otro: "Evento",
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

function badgeClass(estado: CitaDTO["estado"]) {
    if (estado === "programada")
        return "bg-gold/12 text-gold border border-gold";
    if (estado === "realizada")
        return "bg-emerald-500/12 text-emerald-800 border border-emerald-800";
    if (estado === "cancelada")
        return "bg-danger/12 text-danger border border-danger";
    return "bg-gray-100/10 text-gray-800";
}

const CardCita = (params: CitaEnriquecida) => {
    return (
        <TextCard
            title={params.id_cita}
            children=<div className="flex flex-col md:flex-row">
                <div className="hidden md:flex items-center justify-center w-16 text-center p-3 flex-col">
                    <span className="text-xl font-semibold text-cream">
                        {formatDia(params.fecha_hora)}
                    </span>

                    <span className="text-xs text-cream-dim uppercase">
                        {formatMes(params.fecha_hora)}
                    </span>
                </div>

                <div className="hidden md:block w-1 bg-gold" />

                <div className="flex-1 grid p-4">
                    <div className="text-base font-medium text-cream">
                        {params.tituloSolicitud}
                    </div>

                    {/* Móvil */}
                    <div className="md:hidden text-sm text-cream-dim my-1">
                        <span>
                            {formatDia(params.fecha_hora)}{" "}
                            {formatMes(params.fecha_hora)}
                        </span>
                        <span className="mx-1">·</span>
                        <span>{formatHora(params.fecha_hora)}</span>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block text-sm text-cream-dim my-1">
                        {formatHora(params.fecha_hora)}
                    </div>

                    {params.estado === "cancelada" ? (
                        <div className="mt-4 text-sm text-cream-dim my-1">
                            {params.observaciones ?? "Sin observacion"}
                        </div>
                    ) : (
                        <Button
                            href={params.enlace_videollamada}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant={"outline"}
                            size={"sm"}
                        >
                            Unirse a la videollamada
                        </Button>
                    )}
                </div>
                <div className="flex flex-col h-full justify-between">
                    <span
                        className={`text-center px-3 py-1 m-3 w-full text-xs font-medium h-min ${badgeClass(params.estado)}`}
                    >
                        {STATUS_LABEL[params.estado]}
                    </span>
                </div>
            </div>
        />
    );
};

export default function MisCitas() {
    const [filter, setFilter] = useState<FilterType>("Todas");
    const { data: solicitudes, isLoading: loadingSolicitudes } =
        useMisSolicitudes();

    const solicitudIds = solicitudes?.map((s) => s.id_solicitud) ?? [];

    // Mismo queryKey que useCitasBySolicitud (['citas','solicitud', id]) para
    // compartir caché e invalidación con el resto del módulo.
    const citasQueries = useQueries({
        queries: solicitudIds.map((id) => ({
            queryKey: ["citas", "solicitud", id],
            queryFn: () => citaService.getBySolicitud(id),
            enabled: Boolean(id),
        })),
    });

    const loadingCitas = citasQueries.some((q) => q.isLoading);

    const citasEnriquecidas = useMemo<CitaEnriquecida[]>(() => {
        if (!solicitudes) return [];
        const resultado: CitaEnriquecida[] = [];
        solicitudes.forEach((solicitud, index) => {
            const citas = citasQueries[index]?.data ?? [];
            const label =
                TIPO_EVENTO_LABEL[solicitud.tipo_evento] ??
                solicitud.tipo_evento;
            citas.forEach((cita) => {
                resultado.push({
                    ...cita,
                    tituloSolicitud: `Cita de negociación — ${label}`,
                });
            });
        });
        return resultado;
    }, [solicitudes, citasQueries]);

    const filteredProximas = citasEnriquecidas.filter(
        (c) =>
            c.estado === "programada" &&
            (filter === "Todas" || filter === "Programadas"),
    );

    const filteredHistorial = citasEnriquecidas.filter((c) => {
        if (c.estado === "programada") return false;
        if (filter === "Todas") return true;
        if (filter === "Realizadas") return c.estado === "realizada";
        if (filter === "Canceladas") return c.estado === "cancelada";
        return false;
    });

    const isLoading = loadingSolicitudes || loadingCitas;

    return (
        <div className="mx-auto max-w-3xl">
            <header>
                <h1 className="font-display text-3xl font-normal text-balance text-cream sm:text-5xl">
                    Mis citas
                </h1>
                <p className="mt-4 text-sm text-pretty text-cream-dim sm:text-base">
                    Reuniones virtuales programadas con el equipo de iParty DJs
                </p>
            </header>

            <Filters
                filters={FILTERS}
                value={filter}
                onChange={setFilter}
                className="mt-6 mb-6"
            />

            {isLoading && <p>Cargando citas...</p>}

            {!isLoading && filteredProximas.length > 0 && (
                <>
                    <div className="text-sm font-semibold text-gray-400 uppercase mb-3">
                        Próximas
                    </div>
                    <div className="space-y-4">
                        {filteredProximas.map((cita) => CardCita(cita))}
                    </div>
                </>
            )}

            {!isLoading && filteredHistorial.length > 0 && (
                <>
                    <div className="text-sm font-semibold text-gray-400 uppercase mt-8 mb-3">
                        Historial
                    </div>
                    <div className="space-y-4">
                        {filteredHistorial.map((cita) => CardCita(cita))}
                    </div>
                </>
            )}

            {!isLoading &&
                filteredProximas.length === 0 &&
                filteredHistorial.length === 0 && (
                    <div className="text-center text-cream-dim py-8">
                        No hay citas en esta categoría.
                    </div>
                )}
        </div>
    );
}
