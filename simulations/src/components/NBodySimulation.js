import React, { useRef, useEffect, useState } from 'react'

const G = 0.1;
const timeStep = 1;
const softening = 1;

class Body {
    constructor(x, y, mass, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
    }

    updatePosition() {
        this.x += this.vx * timeStep;
        this.y += this.vy * timeStep;
    }

    applyForce(fx, fy) {
        this.vx += (fx / this.mass) * timeStep;
        this.vy += (fy / this.mass) * timeStep;
    }
}

class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.bodies = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, width, height } = this.boundary;
        const nw = { x, y, width: width / 2, height: height / 2 };
        const ne = { x: x + width / 2, y, width: width / 2, height: height / 2 };
        const sw = { x, y: y + height / 2, width: width / 2, height: height / 2 };
        const se = { x: x + width / 2, y: y + height / 2, width: width / 2, height: height / 2 };

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
        this.divided = true;
    }

    insert(body) {
        if (!this.contains(body)) return false;

        if (this.bodies.length < this.capacity) {
            this.bodies.push(body);
            return true;
        }

        if (!this.divided) this.subdivide();

        return (
            this.northwest.insert(body) ||
            this.northeast.insert(body) ||
            this.southwest.insert(body) ||
            this.southeast.insert(body)
        );
    }

    contains(body) {
        return (
            body.x >= this.boundary.x &&
            body.x <= this.boundary.x + this.boundary.width &&
            body.y >= this.boundary.y &&
            body.y <= this.boundary.y + this.boundary.height
        );
    }

    query(body, theta = 0.5) {
        const forces = { fx: 0, fy: 0 };
        if (!this.divided) {
            this.bodies.forEach((other) => {
                if (other !== body) {
                    const dx = other.x - body.x;
                    const dy = other.y - body.y;
                    const distance = Math.sqrt(dx * dx + dy * dy + softening * softening);
                    const force = Math.min((G * body.mass * other.mass) / (distance * distance), 50);
                    forces.fx += (force * dx) / distance;
                    forces.fy += (force * dy) / distance;
                }
            });
            return forces;
        }

        const totalMass = this.bodies.reduce((acc, b) => acc + b.mass, 0);
        const centerOfMass = {
            x: this.bodies.reduce((acc, b) => acc + b.x * b.mass, 0) / totalMass,
            y: this.bodies.reduce((acc, b) => acc + b.y * b.mass, 0) / totalMass,
        };

        const distanceToCOM = Math.sqrt((centerOfMass.x - body.x) ** 2 + (centerOfMass.y - body.y) ** 2 + softening * softening);

        if ((this.boundary.width / distanceToCOM) < theta) {
            const force = (G * body.mass * totalMass) / (distanceToCOM * distanceToCOM);
            const dx = centerOfMass.x - body.x;
            const dy = centerOfMass.y - body.y;
            forces.fx += (force * dx) / distanceToCOM;
            forces.fy += (force * dy) / distanceToCOM;
        } else {
            forces.fx += this.northwest.query(body, theta).fx;
            forces.fy += this.northwest.query(body, theta).fy;
            forces.fx += this.northeast.query(body, theta).fx;
            forces.fy += this.northeast.query(body, theta).fy;
            forces.fx += this.southwest.query(body, theta).fx;
            forces.fy += this.southwest.query(body, theta).fy;
            forces.fx += this.southeast.query(body, theta).fx;
            forces.fy += this.southeast.query(body, theta).fy;
        }
        return forces;
    }

}


const NBodySimulation = () => {
    const canvasRef = useRef(null);
    const [bodies, setBodies] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const addBody = (x, y) => {
        const mass = 8000;
        let vx = 0;
        let vy = 0;

        if (bodies.length === 0) {
            vx = 0;
            vy = -1;
        } else if (bodies.length === 1) {
            vx = 0;
            vy = 1;
        }
        const newBody = new Body(x, y, mass, vx, vy);
        setBodies((prevBodies) => [...prevBodies, newBody]);
    }

    const toggleSimulation = () => {
        setIsRunning(!isRunning);
    }

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addBody(x, y);
    }

    const add50Bodies = () => {
        for (let i = 0; i < 50; i++) {
            addBody(Math.random() * 400, Math.random() * 400);
        }
    }

    const resetSimulation = () => {
        setBodies([]);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        canvas.style.backgroundColor = 'black';

        bodies.forEach((body) => {
            ctx.beginPath();
            ctx.arc(body.x, body.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        });

        if (bodies.length > 0) {
            const totalMass = bodies.reduce((sum, body) => sum + body.mass, 0);
            const centerOfMass = bodies.reduce(
                (acc, body) => {
                    acc.x += body.x * body.mass;
                    acc.y += body.y * body.mass;
                    return acc;
                },
                { x: 0, y: 0 }
            );
            centerOfMass.x /= totalMass;
            centerOfMass.y /= totalMass;

            // Massenschwerpunkt zeichnen
            ctx.strokeStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(centerOfMass.x - 5, centerOfMass.y);
            ctx.lineTo(centerOfMass.x + 5, centerOfMass.y);
            ctx.moveTo(centerOfMass.x, centerOfMass.y - 5);
            ctx.lineTo(centerOfMass.x, centerOfMass.y + 5);
            ctx.stroke();
        }

    }, [bodies]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning && bodies.length > 0) {

                const boundary = { x: 0, y: 0, width: 400, height: 400 };
                const quadTree = new QuadTree(boundary, 4);

                bodies.forEach((body) => quadTree.insert(body));

                bodies.forEach((body) => {
                    const forces = quadTree.query(body);
                    body.applyForce(forces.fx, forces.fy);
                    body.updatePosition();
                })

                setBodies([...bodies]);
            }
        }, 16);
        return () => clearInterval(interval);
    }, [isRunning, bodies]);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{color: 'red'}}>Click to add a body</p>
            <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid white' }} onClick={handleCanvasClick} />
            <div style={{ marginTop: '10px' }}>
                <button onClick={toggleSimulation}> {isRunning ? 'Stop' : 'Start'} Simulation</button>
                <button onClick={add50Bodies}>Add 50 Bodies</button>
                <button onClick={resetSimulation}>Reset</button>
            </div>
        </div>
    )
}

export default NBodySimulation