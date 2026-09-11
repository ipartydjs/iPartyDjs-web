/* ===== src/features/solicitudes/components/SolicitudForm.tsx ===== */
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
    CreateSolicitudSchema,
    type CreateSolicitudInput,
    type TipoEvento,
} from "@ipartydjs/shared";
import { ButtonForm, Input, Select } from "@/shared/ui";

interface SolicitudFormInitialData {
    fecha_deseada?: string; // llega como ISO string desde SolicitudEventoDTO
    direccion?: string;
    tipo_evento?: TipoEvento;
}

interface SolicitudFormProps {
    onSubmit: (data: CreateSolicitudInput) => void;
    initialData?: SolicitudFormInitialData;
    isLoading?: boolean;
    mode: "crear" | "editar";
}

// Tipo de ENTRADA del schema: lo que existe en el form antes de que Zod
// transforme/coaccione fecha_deseada a Date. z.input<> ≠ z.output<> cuando
// el schema usa coerce/transform — por eso hacen falta ambos.
type SolicitudFormValues = z.input<typeof CreateSolicitudSchema>;

export function SolicitudForm({
    onSubmit,
    initialData,
    isLoading,
    mode,
}: SolicitudFormProps) {
    const defaultValues = useMemo(
        () => ({
            fecha_deseada: initialData?.fecha_deseada
                ? new Date(initialData.fecha_deseada)
                : undefined,
            direccion: initialData?.direccion ?? "",
            tipo_evento: initialData?.tipo_evento ?? "boda",
        }),
        [
            initialData?.fecha_deseada,
            initialData?.direccion,
            initialData?.tipo_evento,
        ],
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SolicitudFormValues, unknown, CreateSolicitudInput>({
        resolver: zodResolver(CreateSolicitudSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form
            className="solicitud-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Input
                        label="Fecha deseada del evento"
                        type="date"
                        {...register("fecha_deseada", { valueAsDate: true })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Select
                        label="Tipo de evento"
                        {...register("tipo_evento")}
                        options={[
                            { label: "Boda", value: "boda" },
                            {
                                label: "XV Años",
                                value: "xv_anos",
                            },
                            {
                                label: "Cumpleaños",
                                value: "cumpleanos",
                            },
                            {
                                label: "Corporativo",
                                value: "corporativo",
                            },
                            {
                                label: "Otro",
                                value: "otro",
                            },
                        ]}
                        error={errors.tipo_evento?.message}
                        required
                    />
                </div>
            </div>

            <br />
            <Input
                label="Dirección deseada del evento"
                type="text"
                {...register("direccion", { valueAsDate: true })}
                error={errors.direccion?.message}
            />
            <br />

            <br />

            <ButtonForm type="submit" disabled={isLoading} className="w-full">
                {isLoading
                    ? "Guardando..."
                    : mode === "crear"
                      ? "Crear solicitud"
                      : "Actualizar solicitud"}
            </ButtonForm>
        </form>
    );
}
