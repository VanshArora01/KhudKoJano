import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        const starCount = 150;

        class Star {
            x: number;
            y: number;
            size: number;
            speed: number;
            opacity: number;
            blinkSpeed: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5;
                this.speed = Math.random() * 0.05;
                this.opacity = Math.random();
                this.blinkSpeed = 0.005 + Math.random() * 0.01;
            }

            update(width: number, height: number) {
                this.y -= this.speed;
                if (this.y < 0) this.y = height;

                this.opacity += this.blinkSpeed;
                if (this.opacity > 1 || this.opacity < 0.2) {
                    this.blinkSpeed = -this.blinkSpeed;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = `rgba(198, 168, 94, ${this.opacity * 0.5})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = Array.from({ length: starCount }, () => new Star(canvas.width, canvas.height));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a subtle gradient bridge
            const grad = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            grad.addColorStop(0, '#0E0F1A');
            grad.addColorStop(1, '#05060A');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update(canvas.width, canvas.height);
                star.draw(ctx);
            });

            // Draw faint constellation lines
            ctx.strokeStyle = 'rgba(159, 143, 214, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 40; i++) {
                const s1 = stars[i];
                const s2 = stars[(i + 1) % 40];
                if (Math.hypot(s1.x - s2.x, s1.y - s2.y) < 150) {
                    ctx.beginPath();
                    ctx.moveTo(s1.x, s1.y);
                    ctx.lineTo(s2.x, s2.y);
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};

export default CosmicBackground;
