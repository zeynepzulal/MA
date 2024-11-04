import React, { useEffect, useRef } from 'react'

const TwoBodySimulation = () => {

    const canvasRef = useRef(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        let body1 = { x: 300, y: 300, vx: 0, vy: 2, mass: 1000, path: [] };

        let body2 = { x: 500, y: 300, vx: 0, vy: -2, mass: 1000, path: [] };

        const G = 0.1;
        const maxTrailLength = 100;
        const softening = 0.1;

        function update() {

            //distance
            const dx = body2.x - body1.x;
            const dy = body2.y - body1.y;
            const distance = Math.sqrt(dx * dx + dy * dy + softening);

            //gravitational force
            const force = (G * body1.mass * body2.mass) / (distance * distance);

            //direction of force
            const ax1 = (force * dx) / (body1.mass * distance);
            const ay1 = (force * dy) / (body1.mass * distance);
            const ax2 = -(force * dx) / (body2.mass * distance);
            const ay2 = -(force * dy) / (body2.mass * distance);

            //update v 
            body1.vx += ax1;
            body1.vy += ay1;
            body2.vx += ax2;
            body2.vy += ay2;

            //update position => new position = current position + v.t
            body1.x += body1.vx;
            body1.y += body1.vy;
            body2.x += body2.vx;
            body2.y += body2.vy;
        }

        function drawPath(body, color) {
            body.path.push({ x: body.x, y: body.y });
            if (body.path.length > maxTrailLength) body.path.shift();

            context.strokeStyle = color;
            context.beginPath();
            for (let i = 0; i < body.path.length - 1; i++) {
                context.moveTo(body.path[i].x, body.path[i].y);
                context.lineTo(body.path[i + 1].x, body.path[i + 1].y);
            }
            context.stroke();
        }

        function drawBody(body, color) {
            context.beginPath();
            context.arc(body.x, body.y, 10, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }

        function animate() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            update();
            drawPath(body1, 'blue');
            drawPath(body2, 'red');
            drawBody(body1, 'blue');
            drawBody(body2, 'red');
            requestAnimationFrame(animate);
        }

        animate();
    }, []);



    return (<canvas ref={canvasRef} style={{ border: '1px solid black' }} />)

};

export default TwoBodySimulation
