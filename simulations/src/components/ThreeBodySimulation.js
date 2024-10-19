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
        function calculateForces(bodyA,bodyB){
            const dx = bodyB.x-bodyA.x;
            const dy = bodyB.y-bodyA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = (G * bodyA.mass * bodyBmass) / (distance * distance);
            
            const ax = (force * dx) / (bodyA.mass * distance);
            const ay = (force * dy) / (bodyA.mass * distance);
            
            return { ax, ay } ;
            
        }
        
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