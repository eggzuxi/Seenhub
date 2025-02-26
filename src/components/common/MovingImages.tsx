import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
    { id: 1, src: "/images/music.png", alt: "Music" },
    { id: 2, src: "/images/movie.png", alt: "Movie" },
    { id: 3, src: "/images/book.png", alt: "Book" },
];

const imageSize = 300; // 원하는 크기로 변경 가능

const MovingImages = () => {
    const [positions, setPositions] = useState(
        images.map(() => ({
            x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
            y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
            angle: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
        }))
    );

    useEffect(() => {
        let animationFrameId: number;

        const updatePositions = () => {
            setPositions((prevPositions) =>
                prevPositions.map((pos) => {
                    let newX = pos.x + Math.cos(pos.angle) * pos.speed * 5 * pos.directionX;
                    let newY = pos.y + Math.sin(pos.angle) * pos.speed * 5 * pos.directionY;
                    let newDirectionX = pos.directionX;
                    let newDirectionY = pos.directionY;

                    // 화면 경계 체크 (벗어나면 반대 방향으로 이동)
                    if (typeof window !== "undefined" && (newX < 0 || newX > window.innerWidth - imageSize)) {
                        newDirectionX *= -1;
                        newX = Math.max(0, Math.min(newX, window.innerWidth - imageSize));
                    }
                    if (typeof window !== "undefined" && (newY < 0 || newY > window.innerHeight - imageSize)) {
                        newDirectionY *= -1;
                        newY = Math.max(0, Math.min(newY, window.innerHeight - imageSize));
                    }

                    return {
                        x: newX,
                        y: newY,
                        angle: pos.angle + 0.02,
                        speed: pos.speed,
                        directionX: newDirectionX,
                        directionY: newDirectionY,
                    };
                })
            );
            animationFrameId = requestAnimationFrame(updatePositions);
        };

        animationFrameId = requestAnimationFrame(updatePositions);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="relative inset-0 z-10">
            {images.map((item, index) => (
                <motion.img
                    key={item.id}
                    src={item.src}
                    alt={item.alt}
                    className="absolute"
                    style={{ width: `${imageSize}px`, height: `${imageSize}px` }} // 동적으로 크기 적용
                    animate={{ x: positions[index].x, y: positions[index].y }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />
            ))}
        </div>
    );
};

export default MovingImages;
