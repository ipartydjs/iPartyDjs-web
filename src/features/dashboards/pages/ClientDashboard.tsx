import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import type { CitaDTO, EventoDTO, SolicitudEventoDTO } from "@ipartydjs/shared";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useMisSolicitudes } from "@/features/solicitudes/hooks/useSolicitudes";
import { citaService } from "@/features/citas/services/cita.service";
import { useMisEventos } from "@/features/eventos/hooks/useEventos";
import { useReseniaByEvento } from "@/features/resenias/hooks/useResenias";
import { TextCard, type TextCardParams } from "@/shared/ui/TextCard";

const TIPO_EVENTO_LABEL: Record<string, string> = {
    boda: "Boda",
    xv_anos: "XV años",
    cumpleanos: "Cumpleaños",
    corporativo: "Corporativo",
    otro: "Evento",
};

const ESTADO_SOLICITUD_LABEL: Record<string, string> = {
    pendiente: "pendiente",
    en_proceso: "en proceso",
    completada: "completada",
    rechazada: "rechazada",
};

const ESTADO_EVENTO_LABEL: Record<string, string> = {
    confirmado: "Confirmado",
    en_preparacion: "En preparación",
    realizado: "Realizado",
};

export const ClientDashboard: React.FC = () => {
    const { data: user, isLoading: loadingProfile } = useProfile();
    const { data: solicitudes, isLoading: loadingSolicitudes } =
        useMisSolicitudes();
    const { data: eventos, isLoading: loadingEventos } = useMisEventos();

    const solicitudIds = solicitudes?.map((s) => s.id_solicitud) ?? [];

    // Mismo patrón de enriquecimiento por useQueries usado en MisCitas.tsx /
    // ListaCitasAdmin.tsx: se resuelven las citas de cada solicitud en paralelo.
    const citasQueries = useQueries({
        queries: solicitudIds.map((id) => ({
            queryKey: ["citas", "solicitud", id],
            queryFn: () => citaService.getBySolicitud(id),
            enabled: Boolean(id),
        })),
    });

    const loadingCitas = citasQueries.some((q) => q.isLoading);

    const todasLasCitas = useMemo<CitaDTO[]>(() => {
        return citasQueries.flatMap((q) => q.data ?? []);
    }, [citasQueries]);

    // "Próxima cita": la más cercana en el futuro, entre 'programada'.
    const proximaCita = useMemo<CitaDTO | undefined>(() => {
        const ahora = Date.now();
        return todasLasCitas
            .filter(
                (c) =>
                    c.estado === "programada" &&
                    new Date(c.fecha_hora).getTime() > ahora,
            )
            .sort(
                (a, b) =>
                    new Date(a.fecha_hora).getTime() -
                    new Date(b.fecha_hora).getTime(),
            )[0];
    }, [todasLasCitas]);

    const solicitudDeCitaProxima = solicitudes?.find(
        (s) => s.id_solicitud === proximaCita?.id_solicitud,
    );

    // Selección del "evento relevante" — ver criterio de prioridad en el
    // mensaje que acompaña este código: activo > realizado sin reseña > ninguno.
    const eventoRelevante = useMemo<EventoDTO | undefined>(() => {
        if (!eventos || eventos.length === 0) return undefined;
        const activos = eventos
            .filter((e) => e.estado !== "realizado")
            .sort(
                (a, b) =>
                    new Date(a.fecha_hora).getTime() -
                    new Date(b.fecha_hora).getTime(),
            );
        if (activos.length > 0) return activos[0];

        const realizados = eventos
            .filter((e) => e.estado === "realizado")
            .sort(
                (a, b) =>
                    new Date(b.fecha_hora).getTime() -
                    new Date(a.fecha_hora).getTime(),
            );
        return realizados[0];
    }, [eventos]);

    const { data: reseniaDelEvento, isLoading: loadingResenia } =
        useReseniaByEvento(
            eventoRelevante?.estado === "realizado"
                ? eventoRelevante.id_evento
                : "",
        );

    const solicitudDelEvento: SolicitudEventoDTO | undefined =
        solicitudes?.find(
            (s) => s.id_solicitud === eventoRelevante?.id_solicitud,
        );

    const kpiSolicitudes = useMemo(() => {
        const total = solicitudes?.length ?? 0;
        const porEstado: Record<string, number> = {};
        solicitudes?.forEach((s) => {
            porEstado[s.estado] = (porEstado[s.estado] ?? 0) + 1;
        });
        return { total, porEstado };
    }, [solicitudes]);

    const reseniaEstadoTexto = (() => {
        if (!eventoRelevante || eventoRelevante.estado !== "realizado")
            return "Aún no disponible";

        if (loadingResenia) return "Cargando...";
        if (!reseniaDelEvento) return "Disponible";
        if (reseniaDelEvento.estado === "pendiente")
            return "Pendiente de aprobación";

        if (reseniaDelEvento.estado === "aprobado") return "Aprobada";

        return "Rechazada";
    })();

    // Progreso aproximado del flujo activo (solicitud -> cita -> evento),
    // solo con datos que sí existen (no hay columna de "fecha de transición").
    const segmentoActivo = eventoRelevante
        ? 3
        : solicitudDeCitaProxima?.estado === "completada"
          ? 2
          : solicitudDeCitaProxima ||
              solicitudes?.some((s) => s.estado === "en_proceso")
            ? 1
            : 0;

    const isLoading =
        loadingProfile || loadingSolicitudes || loadingEventos || loadingCitas;

    if (isLoading) {
        return <div className="profile-page">Cargando panel...</div>;
    }

    const stats = (): TextCardParams[] => {
        const services: TextCardParams[] = [
            {
                value: "♪",
                title: "Dirección Musical",
                description:
                    "Selección musical personalizada, DJ profesional y animación para cada momento de tu evento.",
            },
            {
                value: "◈",
                title: "Diseño Sonoro",
                description:
                    "Sistemas profesionales de audio, acústica y efectos sonoros de última generación.",
            },
            {
                value: "✦",
                title: "Diseño Visual",
                description:
                    "Pantallas LED, iluminación arquitectónica robótica y ambientación visual completa.",
            },
            {
                value: "◉",
                title: "Producción Integral",
                description:
                    "Coordinación total del evento: logística, montaje, contenido digital y efectos especiales.",
            },
        ];
        if (
            !kpiSolicitudes &&
            !proximaCita &&
            !eventoRelevante &&
            !reseniaEstadoTexto
        )
            return services;

        return [
            {
                value: `${kpiSolicitudes.total}`,
                title: "Solicitudes",
                description:
                    Object.entries(kpiSolicitudes.porEstado)
                        .map(
                            ([estado, n]) =>
                                `${n} ${ESTADO_SOLICITUD_LABEL[estado] ?? estado}`,
                        )
                        .join(" · ") || "Sin solicitudes",
            },
            {
                value: proximaCita
                    ? new Date(proximaCita.fecha_hora).toLocaleDateString(
                          "es-MX",
                          {
                              day: "2-digit",
                              month: "short",
                          },
                      )
                    : "—",
                title: "Próxima cita",
                description: proximaCita
                    ? `${new Date(proximaCita.fecha_hora).toLocaleTimeString(
                          "es-MX",
                          {
                              hour: "numeric",
                              minute: "2-digit",
                          },
                      )} · Videollamada`
                    : "Sin citas programadas",
            },
            {
                value: eventoRelevante
                    ? (ESTADO_EVENTO_LABEL[eventoRelevante.estado] ??
                      eventoRelevante.estado)
                    : "Sin evento aún",
                colorTitle:
                    eventoRelevante?.estado === "realizado"
                        ? "text-emerald-300"
                        : eventoRelevante?.estado === "confirmado"
                          ? "text-blue-300"
                          : "text-gold",
                title: "Mi evento",
                description: eventoRelevante
                    ? `${TIPO_EVENTO_LABEL[eventoRelevante.tipo_evento] ?? eventoRelevante.tipo_evento} · ${new Date(
                          eventoRelevante.fecha_hora,
                      ).toLocaleDateString("es-MX")}`
                    : "Aún no registrado",
            },
            {
                value: `${reseniaEstadoTexto}`,
                colorTitle:
                    reseniaEstadoTexto === "Aprobada"
                        ? "text-emerald-300"
                        : reseniaEstadoTexto === "Disponible" ||
                            reseniaEstadoTexto === "Pendiente de aprobación"
                          ? "text-blue-300"
                          : "text-gold",
                title: "Reseña",
                description:
                    eventoRelevante?.estado === "realizado"
                        ? "Evento ya realizado"
                        : "Disponible tras el evento",
            },
        ];
    };

    return (
        <>
            <header className="dashboard-header ">
                <h1 className="text-3xl lg:text-4xl font-display">
                    Bienvenido, {user?.nombre} 👋
                </h1>
                <p className="mt-4 font-light">
                    {`Fecha de hoy ${new Date().toLocaleDateString("es-MX")}`}
                    {proximaCita &&
                        ` · Tu próxima cita es el ${new Date(
                            proximaCita.fecha_hora,
                        ).toLocaleDateString("es-MX")}`}
                </p>
            </header>

            <section className="mx-auto mb-20 grid mt-10 max-w-6xl grid-cols-1 gap-0.5 md:grid-cols-2 xl:grid-cols-4">
                {stats().map((s, i) => (
                    <TextCard
                        title={s.value}
                        colorTitle={s.colorTitle}
                        classValue="text-2xl"
                        value={s.title}
                        description={s.description}
                        idx={i}
                    />
                ))}
            </section>

            <section className="content-grid">
                <div className="dashboard-card main-appointment-card">
                    <div className="card-header">
                        <h2>Próxima cita</h2>
                        {proximaCita && (
                            <span className="badge-status">Programada</span>
                        )}
                    </div>
                    <div className="appointment-body">
                        {proximaCita ? (
                            <>
                                <h3 className="appointment-date">
                                    {new Date(
                                        proximaCita.fecha_hora,
                                    ).toLocaleDateString("es-MX", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "short",
                                    })}{" "}
                                    ·{" "}
                                    {new Date(
                                        proximaCita.fecha_hora,
                                    ).toLocaleTimeString("es-MX", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </h3>
                                <p className="appointment-desc">
                                    Videollamada para definir detalles
                                    {solicitudDeCitaProxima
                                        ? ` de ${
                                              TIPO_EVENTO_LABEL[
                                                  solicitudDeCitaProxima
                                                      .tipo_evento
                                              ] ??
                                              solicitudDeCitaProxima.tipo_evento
                                          }`
                                        : ""}
                                </p>

                                <div className="meet-link-container">
                                    <label>Enlace Meet disponible</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={proximaCita.enlace_videollamada}
                                        className="meet-input"
                                    />
                                </div>
                                <a
                                    href={proximaCita.enlace_videollamada}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary-gold"
                                >
                                    Unirme a la videollamada
                                </a>
                            </>
                        ) : (
                            <p className="appointment-desc">
                                No tienes citas programadas por ahora.
                            </p>
                        )}
                    </div>
                </div>

                <div className="dashboard-card event-status-card">
                    <div className="card-header">
                        <h2>Estado de mi evento</h2>
                        {eventoRelevante && (
                            <Link
                                to={`/eventos/${eventoRelevante.id_evento}`}
                                className="link-detail"
                            >
                                Ver detalle →
                            </Link>
                        )}
                    </div>

                    {eventoRelevante ? (
                        <div className="event-details-list">
                            <div className="status-badge-row">
                                <span className="badge-pill-green">
                                    ●{" "}
                                    {ESTADO_EVENTO_LABEL[
                                        eventoRelevante.estado
                                    ] ?? eventoRelevante.estado}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Tipo</span>
                                <span className="detail-value">
                                    {TIPO_EVENTO_LABEL[
                                        eventoRelevante.tipo_evento
                                    ] ?? eventoRelevante.tipo_evento}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">
                                    Fecha del evento
                                </span>
                                <span className="detail-value">
                                    {new Date(
                                        eventoRelevante.fecha_hora,
                                    ).toLocaleDateString("es-MX")}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Dirección</span>
                                <span className="detail-value">
                                    {eventoRelevante.direccion}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Cliente</span>
                                <span className="detail-value">
                                    {user?.nombre} {user?.apellido}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Progreso</span>
                                <div className="progress-bar-container">
                                    <div
                                        className={`progress-segment ${segmentoActivo >= 1 ? "active" : ""}`}
                                    />
                                    <div
                                        className={`progress-segment ${segmentoActivo >= 2 ? "active" : ""}`}
                                    />
                                    <div
                                        className={`progress-segment ${segmentoActivo >= 3 ? "active" : ""}`}
                                    />
                                </div>
                            </div>

                            <hr className="card-divider" />

                            <div className="timeline-section">
                                <h3>Línea de tiempo</h3>
                                <div className="timeline">
                                    {solicitudDelEvento && (
                                        <div className="timeline-item done">
                                            <div className="timeline-dot" />
                                            <div className="timeline-info">
                                                <p className="timeline-title">
                                                    Solicitud enviada
                                                </p>
                                                <span className="timeline-date">
                                                    {new Date(
                                                        solicitudDelEvento.created_at,
                                                    ).toLocaleDateString(
                                                        "es-MX",
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {proximaCita && (
                                        <div className="timeline-item done">
                                            <div className="timeline-dot" />
                                            <div className="timeline-info">
                                                <p className="timeline-title">
                                                    Cita programada
                                                </p>
                                                {/* Fecha real programada, no una fecha de transición inferida. */}
                                                <span className="timeline-date">
                                                    {new Date(
                                                        proximaCita.fecha_hora,
                                                    ).toLocaleDateString(
                                                        "es-MX",
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`timeline-item ${
                                            todasLasCitas.some(
                                                (c) => c.estado === "realizada",
                                            )
                                                ? "done"
                                                : "pending"
                                        }`}
                                    >
                                        <div className="timeline-dot" />
                                        <div className="timeline-info">
                                            <p className="timeline-title">
                                                Cita realizada
                                            </p>
                                            <span className="timeline-date">
                                                {todasLasCitas.some(
                                                    (c) =>
                                                        c.estado ===
                                                        "realizada",
                                                )
                                                    ? "Completada"
                                                    : "Pendiente"}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`timeline-item ${
                                            eventoRelevante.estado ===
                                            "realizado"
                                                ? "done"
                                                : "future"
                                        }`}
                                    >
                                        <div className="timeline-dot" />
                                        <div className="timeline-info">
                                            <p className="timeline-title">
                                                Evento realizado
                                            </p>
                                            {/* Fecha programada del evento, no fecha real de
                            realización (esa transición no se registra). */}
                                            <span className="timeline-date">
                                                {new Date(
                                                    eventoRelevante.fecha_hora,
                                                ).toLocaleDateString("es-MX")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="appointment-desc">
                            Aún no tienes un evento registrado.
                        </p>
                    )}
                </div>
            </section>
        </>
    );
};
