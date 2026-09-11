import { useRef, useEffect, useState } from "react";
import { SectionHeader, MasonryGrid } from "@/shared/ui";
import GalleryCard from "./gallery/GalleryCard";
import GallerySkeleton from "./gallery/GallerySkeleton";
import { galeria } from "@/core/api/fotografiaApi";
import type { FotografiaDTO } from "@ipartydjs/shared";

const Gallery = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

    const [photos, setPhotos] = useState<FotografiaDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        const fetchGalleryPhotos = async () => {
            try {
                setLoading(true);
                const dataList = await galeria();
                setPhotos(dataList);
            } catch (err: unknown) {
                setError(
                    (err as Error).message ||
                        "Ocurrió un error al cargar la galería.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryPhotos();
    }, []);

    const getDimState = (id: string): "hovered" | "dimmed" | "idle" => {
        if (hovered === null) return "idle";
        return hovered === id ? "hovered" : "dimmed";
    };

    return (
        <section
            id="galeria"
            ref={sectionRef}
            className="bg-on-surface px-6 py-24 lg:px-15 lg:py-35"
        >
            <SectionHeader
                eyebrow="Galería"
                title={
                    <>
                        Momentos que
                        <br />
                        <em className="text-gold italic">
                            hablaron por sí solos.
                        </em>
                    </>
                }
                className="mb-20"
            />

            {loading ? (
                <GallerySkeleton />
            ) : error ? (
                <div className="flex items-center justify-center py-24">
                    <p className="font-body text-sm text-danger">
                        No se pudo cargar la galería en este momento.
                    </p>
                </div>
            ) : photos.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                    <p className="font-body text-sm text-cream-faint">
                        Próximamente nuevos eventos y fotografías.
                    </p>
                </div>
            ) : (
                <MasonryGrid
                    items={photos}
                    columns={3}
                    getKey={(photo) => photo.id_fotografia}
                    className="mx-auto max-w-6xl"
                    renderItem={(photo, index) => (
                        <GalleryCard
                            photo={photo}
                            index={index}
                            visible={visible}
                            dimState={getDimState(photo.id_fotografia)}
                            onHoverStart={() => setHovered(photo.id_fotografia)}
                            onHoverEnd={() => setHovered(null)}
                        />
                    )}
                />
            )}
        </section>
    );
};

export default Gallery;
