import React, { useRef, useEffect, useState } from 'react'

const G = 6.67430e-11;
const timeStep = 0.1; 

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
        if(!this.contains(body)) return false;

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

    contains(body){
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
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              const force = (G * body.mass * other.mass) / (distance * distance);
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
    
        const distanceToCOM = Math.sqrt(
          (centerOfMass.x - body.x) ** 2 + (centerOfMass.y - body.y) ** 2
        );
    
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
        setIsRunning(!isRunning);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        bodies.forEach((body) => {
            ctx.beginPath();
            ctx.arc(body.x, body.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'blue';
            ctx.fill();
        });

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
        <div>
            <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid black' }} />
            <button onClick={addBody}>Add Body</button>
            <button onClick={toggleSimulation}> {isRunning ? 'Stop' : 'Start'} Simulation</button>
        </div>
    )
}

export default NBodySimulation