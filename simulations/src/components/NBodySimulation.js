import React, { useRef, useEffect } from 'react'

class Body {
    constructor(x,y,mass, vx=0, vy=0){
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.vx = vx;
        this.vy = vy;
    }
}
const NBodySimulation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearReact(0, 0, canvas.width, canvas.height)
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid black' }} />

        </div>
    )
}

export default NBodySimulation