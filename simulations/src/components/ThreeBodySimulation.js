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

        drawBody(body1, 'blue');
        drawBody(body2, 'red');
        drawBody(body3, 'green');

        function drawBody(body, color) {
            context.beginPath();
            context.arc(body.x, body.y, 20, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
            context.stroke();
        }

    }, []);

    return (
        <canvas ref={canvasRef} style={{ border: '1px solid black' }} />
    )
}

export default ThreeBodySimulation