import React, { useRef, useEffect, useState } from 'react'

class Body {
    constructor(x, y, mass, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
    }

    updatePosition(timeStep) {
        this.x += this.vx * timeStep;
        this.y += this.vy * timeStep;
    }
}
const NBodySimulation = () => {
    const canvasRef = useRef(null);
    const [bodies, setBodies] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const addBody = () => {
        const newBody = new Body(
            Math.random() * 400,
            Math.random() * 400,
            Math.random() * 10 + 1,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        )
        setBodies((prevBodies) => [...prevBodies, newBody]);
    }

    const toggleSimulation = () => {
        setIsRunning (!isRunning);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        bodies.forEach((body) => {
            ctx.beginPath();
            ctx.arc(body.x, body.y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        });

    }, [bodies]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning) {
                setBodies((prevBodies) =>
                    prevBodies.map((body) => {
                        const updatedBody = new Body(body.x, body.y, body.mass, body.vx, body.vy);
                        updatedBody.updatePosition(0.1);
                        return updatedBody;
                    })
                )
            }
        }, 16);
        return () => clearInterval(interval);
    }, [isRunning]);


    return (
        <div>
            <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid black' }} />
            <button onClick={addBody}>Add Body</button>
            <button onClick={toggleSimulation}> {isRunning ? 'Stop': 'Start'} Simulation</button>
        </div>
    )
}

export default NBodySimulation