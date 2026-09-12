interface FiltersProps<T extends string> {
    filters: T[];
    value: T;
    onChange: (v: T) => void;
    className?: string;
}

export default function Filters<T extends string>({
    filters,
    value,
    onChange,
    className = "",
}: FiltersProps<T>) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {filters.map((f) => (
                <button
                    key={f}
                    type="button"
                    onClick={() => onChange(f)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gold
                        ${
                            value === f
                                ? "bg-gold text-surface font-semibold border border-gold"
                                : "bg-transparent text-gold border border-gold hover:bg-gold/25"
                        }`}
                >
                    {f}
                </button>
            ))}
        </div>
    );
}
