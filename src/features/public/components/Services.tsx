import Overline from "@/shared/ui/Overline";
import { TextCard, type TextCardParams } from "@/shared/ui/TextCard";
import { useRef } from "react";

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

const Services = () => {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            id="servicios"
            ref={sectionRef}
            className="py-40 px-16 bg-surface"
        >
            <div className="mr-9 text-center">
                <div className="mb-8 flex justify-center">
                    <Overline children={"Servicios"} />
                </div>

                <h1 className="font-display text-3xl font-normal text-balance text-cream md:text-6xl sm:text-4xl">
                    Producción de eventos
                    <br />
                    <em className="text-gold">como ningún otro.</em>
                </h1>

                <p className="mt-8 font-body text-sm max-w-lg mx-auto text-pretty text-cream-dim sm:text-base">
                    Trabajamos con los mejores organizadores de eventos para
                    crear experiencias que tú y tus invitados nunca olvidarán.
                </p>
            </div>

            <div className="mx-auto mb-20 grid mt-10 max-w-6xl grid-cols-1 gap-0.5 md:grid-cols-2 xl:grid-cols-4">
                {services.map((s, i) => (
                    <TextCard
                        title={s.title}
                        value={s.value}
                        description={s.description}
                        idx={i}
                    />
                ))}
            </div>

            <div className="text-center">
                <div className="mb-5 tracking-[0.3em] uppercase text-cream/70">
                    Especialistas en
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        "Bodas",
                        "XV Años",
                        "Cumpleaños",
                        "Eventos Empresariales",
                        "Fiestas Privadas",
                    ].map((e) => (
                        <span
                            key={e}
                            className="border border-gold/30 px-5 py-2 text-[0.7rem] tracking-[0.15em] uppercase text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10"
                        >
                            {e}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
