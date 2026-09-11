export type TextCardParams = {
    idx?: number;
    colorTitle?: string;
    classValue?: string;
    title: string;
    value: string;
    description: string;
};

export const TextCard = (params: TextCardParams) => {
    return (
        <div
            key={params.title}
            className={`group relative overflow-hidden bg-on-surface p-[52px_36px] text-left transition-all duration-700 hover:bg-input-normal`}
            style={{ transitionDelay: `${params.idx ?? 0 * 150}ms` }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,209,66,0.06),transparent_60%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
            <div className="relative z-10">
                <div
                    className={`mb-7 block text-gold transition-transform duration-400 group-hover:scale-110 ${params.classValue ?? "text-4xl"}`}
                >
                    {params.value}
                </div>
                <h3
                    className={`mb-4 font-display text-[1.4rem] font-normal tracking-[0.02em] ${params.colorTitle ?? "text-cream"}`}
                >
                    {params.title}
                </h3>
                <p className=" font-light leading-7 text-cream/70">
                    {params.description}
                </p>
            </div>
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
        </div>
    );
};
