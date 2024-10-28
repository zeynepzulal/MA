import React, { useRef, useEffect } from 'react'

const ThreeBodySimulation = () => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        let body1 = { x: 300, y: 300, vx: 0, vy: 2, mass: 1000 };
        let body2 = { x: 500, y: 300, vx: 0, vy: -2, mass: 1000 };
        let body3 = { x: 400, y: 100, vx: 1.5, vy: 0, mass: 1000 };

        const G = 0.1;
        

        function calculateForces(bodyA, bodyB) {
            const dx = bodyB.x - bodyA.x;
            const dy = bodyB.y - bodyA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = (G * bodyA.mass * bodyB.mass) / (distance * distance);

            const ax = (force * dx) / (bodyA.mass * distance);
            const ay = (force * dy) / (bodyA.mass * distance);

            return { ax, ay };
        }

        function update() {
            context.clearRect(0, 0, canvas.width, canvas.height);

            //force on body1
            const force12 = calculateForces(body1, body2);
            const force13 = calculateForces(body1, body3);

            //force on body2
            const force21 = calculateForces(body2, body1);
            const force23 = calculateForces(body2, body3);

            //force on body3
            const force31 = calculateForces(body3, body1);
            const force32 = calculateForces(body3, body2);

            // update v
            body1.vx += force12.ax + force13.ax;
            body1.vy += force12.ay + force13.ay;

            body2.vx += force21.ax + force23.ax;
            body2.vy += force21.ay + force23.ay;

            body3.vx += force31.ax + force32.ax;
            body3.vy += force31.ay + force32.ay;

            // update position Dt  = 1s
            body1.x += body1.vx;
            body1.y += body1.vy;
            body2.x += body2.vx;
            body2.y += body2.vy;
            body3.x += body3.vx;
            body3.y += body3.vy;

            drawBody(body1, 'blue');
            drawBody(body2, 'red');
            drawBody(body3, 'green');
        }

        function drawBody(body, color) {
            context.beginPath();
            context.arc(body.x, body.y, 20, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
            context.stroke();
        }
        function animate() {
            update();
            requestAnimationFrame(animate);
        }

        animate();

    }, []);

    return (
        <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    )
}

export default ThreeBodySimulation