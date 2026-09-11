import Overline from "@/shared/ui/Overline";
import { useEffect, useRef, useState } from "react";

const services = [
    {
        icon: "♪",
        title: "Dirección Musical",
        desc: "Selección musical personalizada, DJ profesional y animación para cada momento de tu evento.",
    },
    {
        icon: "◈",
        title: "Diseño Sonoro",
        desc: "Sistemas profesionales de audio, acústica y efectos sonoros de última generación.",
    },
    {
        icon: "✦",
        title: "Diseño Visual",
        desc: "Pantallas LED, iluminación arquitectónica robótica y ambientación visual completa.",
    },
    {
        icon: "◉",
        title: "Producción Integral",
        desc: "Coordinación total del evento: logística, montaje, contenido digital y efectos especiales.",
    },
];

const Services = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVisible(true);
            },
            { threshold: 0.2 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

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
                    <div
                        key={s.title}
                        className={`group relative overflow-hidden bg-on-surface p-[52px_36px] text-left opacity-0 transition-all duration-700 hover:bg-input-normal ${
                            visible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-8 opacity-0"
                        }`}
                        style={{ transitionDelay: `${i * 150}ms` }}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,209,66,0.06),transparent_60%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                        <div className="relative z-10">
                            <div className="mb-7 block text-4xl text-gold transition-transform duration-400 group-hover:scale-110">
                                {s.icon}
                            </div>
                            <h3 className="mb-4 font-display text-[1.4rem] font-normal tracking-[0.02em] text-cream">
                                {s.title}
                            </h3>
                            <p className=" font-light leading-7 text-cream/70">
                                {s.desc}
                            </p>
                        </div>
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                    </div>
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
