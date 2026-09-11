import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { useContact } from "@/core/hooks/useContact";
import type { CreateContactInput } from "@ipartydjs/shared";
import {
    ButtonForm,
    Input,
    Textarea,
    DecorativeShape,
    Button,
    Select,
} from "@/shared/ui";
import Overline from "@/shared/ui/Overline";

const labelClasses = "text-[0.6rem] tracking-[0.2em] uppercase text-gold";

const Contact = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    const { mutate, isPending, isSuccess, isError, error, reset } =
        useContact();

    const [form, setForm] = useState<CreateContactInput>({
        nombre: "",
        email: "",
        telefono: "",
        tipo_evento: "" as CreateContactInput["tipo_evento"],
        fecha_deseada: undefined,
        lugar: "",
        mensaje: "",
    });

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: CreateContactInput = {
            ...form,
            telefono: form.telefono?.trim() || undefined,
            lugar: form.lugar?.trim() || undefined,
            fecha_deseada: form.fecha_deseada
                ? new Date(form.fecha_deseada)
                : undefined,
        };
        mutate(payload);
    };

    return (
        <section
            id="contacto"
            ref={sectionRef}
            className="relative overflow-hidden bg-surface px-6 py-24 lg:px-15 lg:py-35"
        >
            {/* Glow decorativo, usando componente reutilizable */}
            <DecorativeShape
                kind="glow"
                className="pointer-events-none absolute -bottom-50 -left-50 size-175"
                innerClassName="rounded-full"
                background={
                    "radial-gradient(circle, rgba(var(--color-primary-rgb),0.05) 0%, transparent 70%)"
                }
            />

            <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-15 lg:grid-cols-[1fr_1.4fr]">
                {/* Columna izquierda */}
                <div
                    className={clsx(
                        "transition-all duration-700",
                        visible
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-8 opacity-0",
                    )}
                >
                    <Overline children={"Contacto"} />
                    <br />

                    <h1 className="font-display text-5xl font-normal text-balance text-cream sm:text-7xl">
                        Hablemos.
                        <br />
                        <span className="text-gold not-italic">
                            Tu evento comienza aquí.
                        </span>
                    </h1>

                    <p className="mt-8 font-body text-sm text-pretty text-cream-dim sm:text-base">
                        Cuéntanos tu idea. Nosotros la convertimos en una
                        experiencia que nadie olvidará.
                    </p>

                    <br />

                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4">
                            <span className="mt-0.5 min-w-5 text-base text-gold">
                                ◎
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <span className={labelClasses}>Ubicación</span>
                                <span className="font-body text-[0.8rem] font-light text-cream-secondary">
                                    Cuernavaca-Morelos
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="mt-0.5 min-w-5 text-base text-gold">
                                ◈
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <a
                                    href="https://wa.me/527775102313"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={labelClasses}
                                >
                                    WhatsApp
                                </a>
                                <span className="font-body text-[0.8rem] font-light text-cream-secondary">
                                    +52 777 510 23 13
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="mt-0.5 min-w-5 text-base text-gold">
                                ✦
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <a
                                    href="https://www.instagram.com/iparty_djs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={labelClasses}
                                >
                                    Instagram
                                </a>
                                <span className="font-body text-[0.8rem] font-light text-cream-secondary">
                                    iparty_djs
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha */}
                <div
                    className={clsx(
                        "transition-all delay-200 duration-700",
                        visible
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0",
                    )}
                >
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center gap-4 border border-gold/20 bg-surface-1 px-10 py-20 text-center">
                            <div className="mb-2 flex size-16 items-center justify-center rounded-full border border-gold text-[2.5rem] text-gold">
                                ✓
                            </div>
                            <h3 className="font-display text-[2rem] font-normal text-cream">
                                ¡Mensaje enviado!
                            </h3>
                            <p className="mb-2 font-body text-[0.78rem] font-light text-cream-secondary">
                                Nos pondremos en contacto contigo a la brevedad.
                            </p>
                            <button
                                onClick={() => reset()}
                                className="mt-2 bg-gold px-7 py-3 font-body text-[0.62rem] font-semibold tracking-[0.2em] text-surface uppercase transition-colors duration-300 hover:bg-gold-light"
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Nombre completo"
                                        name="nombre"
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Correo electrónico"
                                        name="email"
                                        type="email"
                                        placeholder="tu@correo.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Teléfono / WhatsApp"
                                        name="telefono"
                                        type="tel"
                                        placeholder="+52 55 0000 0000"
                                        value={form.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Select
                                        label="Tipo de evento"
                                        name="tipo_evento"
                                        value={form.tipo_evento}
                                        onChange={handleChange}
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
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Fecha tentativa del evento"
                                        name="fecha_deseada"
                                        type="date"
                                        defaultValue={""}
                                        value={
                                            form.fecha_deseada
                                                ? new Date(form.fecha_deseada)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label="Lugar del evento"
                                        name="lugar"
                                        type="text"
                                        placeholder="Salón, jardín, ciudad..."
                                        value={form.lugar || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Textarea
                                    label="Cuéntanos sobre tu evento"
                                    name="mensaje"
                                    rows={4}
                                    placeholder="Describe tu visión, número de invitados, servicios que te interesan..."
                                    value={form.mensaje}
                                    onChange={handleChange}
                                />
                            </div>

                            {isError && (
                                <p className="font-body text-sm text-danger">
                                    {error?.message ||
                                        "Ocurrió un error al enviar el formulario."}
                                </p>
                            )}

                            {/* Botón con barrido de relleno al hover (::before del original) */}
                            <ButtonForm type="submit" disabled={isPending}>
                                {isPending ? "Enviando..." : "Enviar Solicitud"}
                            </ButtonForm>
                        </form>
                    )}

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button href="/login">
                            Ya eres cliente? <small>Ingresa a tu perfil</small>
                        </Button>
                        <Button href="/register" variant="outline">
                            O Registrate para ser cliente
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
