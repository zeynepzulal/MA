import React, { useRef, useEffect, useState } from 'react'

const ThreeBodySimulation = () => {

    const canvasRef = useRef(null);
    const [initialCondition, setInitialCondition] = useState('figureEight')

    const InitialConditions = {
        // inital values for figure-8 from  https://www.youtube.com/watch?v=UC40kDpAI8M&list=LL&index=1&t=1032s
        figureEight: [
            { x: 400 + 0.97000436 * 200, y: 300 - 0.24308753 * 200, vx: 0.93240737 / 2, vy: 0.86473146 / 2, mass: 1000 },
            { x: 400 - 0.97000436 * 200, y: 300 + 0.24308753 * 200, vx: 0.93240737 / 2, vy: 0.86473146 / 2, mass: 1000 },
            { x: 400, y: 300, vx: -0.93240737, vy: -0.86473146, mass: 1000 }
        ]
    };

    const [bodies, setBodies] = useState(InitialConditions.figureEight);

    let path1 = [];
    let path2 = [];
    let path3 = [];

    const handleSelectChange = (event) => {
        const selectedCase = event.target.value;
        setInitialCondition(selectedCase);
        setBodies(InitialConditions[selectedCase]);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        context.clearRect(0, 0, canvas.width, canvas.height);
        path1 = [];
        path2 = [];
        path3 = [];

        const G = 0.1;
        const softening = 0.1;

        function calculateForces(bodyA, bodyB) {
            const dx = bodyB.x - bodyA.x;
            const dy = bodyB.y - bodyA.y;
            const distance = Math.sqrt(dx * dx + dy * dy + softening);
            const force = (G * bodyA.mass * bodyB.mass) / (distance * distance);

            const ax = (force * dx) / (bodyA.mass * distance);
            const ay = (force * dy) / (bodyA.mass * distance);

            return { ax, ay };
        }

        function update() {
            //force on body1
            const force12 = calculateForces(bodies[0], bodies[1]);
            const force13 = calculateForces(bodies[0], bodies[2]);

            //force on body2
            const force21 = calculateForces(bodies[1], bodies[0]);
            const force23 = calculateForces(bodies[1], bodies[2]);

            //force on body3
            const force31 = calculateForces(bodies[2], bodies[0]);
            const force32 = calculateForces(bodies[2], bodies[1]);

            // update v
            bodies[0].vx += force12.ax + force13.ax;
            bodies[0].vy += force12.ay + force13.ay;

            bodies[1].vx += force21.ax + force23.ax;
            bodies[1].vy += force21.ay + force23.ay;

            bodies[2].vx += force31.ax + force32.ax;
            bodies[2].vy += force31.ay + force32.ay;

            // update position Dt  = 1s
            bodies[0].x += bodies[0].vx;
            bodies[0].y += bodies[0].vy;
            bodies[1].x += bodies[1].vx;
            bodies[1].y += bodies[1].vy;
            bodies[2].x += bodies[2].vx;
            bodies[2].y += bodies[2].vy;

            path1.push({ x: bodies[0].x, y: bodies[0].y });
            path2.push({ x: bodies[1].x, y: bodies[1].y });
            path3.push({ x: bodies[2].x, y: bodies[2].y });

            if (path1.length > 400) path1.shift();
            if (path2.length > 400) path2.shift();
            if (path3.length > 400) path3.shift();
        }



        function drawBody(body, color) {
            context.beginPath();
            context.arc(body.x, body.y, 3, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.shadowColor = color;
            context.shadowBlur = 10;
            context.fill();
        }

        function drawPath(path, color) {
            context.beginPath();
            context.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                context.lineTo(path[i].x, path[i].y);
            }
            context.strokeStyle = color;
            context.lineWidth = 1.5;
            context.stroke();
        }

        function animate() {
            context.fillStyle = 'rgba(0,0,0,1)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            update();

            drawPath(path1, 'rgb(66, 135, 245)');
            drawPath(path2, 'rgb(245, 66, 66)');
            drawPath(path3, 'rgb(240, 240, 66)');

            drawBody(bodies[0], 'rgb(66, 135, 245)');
            drawBody(bodies[1], 'rgb(245, 66, 66)');
            drawBody(bodies[2], 'rgb(240, 240, 66)');

            requestAnimationFrame(animate);
        }

        animate();

    }, [bodies]);

    return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
            <select value={initialCondition} onChange={handleSelectChange} style={{ marginBottom: '10px', padding: '5px' }}>
                <option value="figureEight">Figure Eight</option>
            </select>
            <canvas ref={canvasRef} style={{ border: '1px solid black', display: 'block', margin: '0 auto', background: 'black' }} />
        </div>

    );
};


export default ThreeBodySimulation