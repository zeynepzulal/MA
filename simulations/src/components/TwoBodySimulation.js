import React, { useEffect, useRef} from 'react'

const TwoBodySimulation = () => {

    const canvasRef = useRef(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;

        let body1 = { x: 300, y: 300, vx: 0, vy: 2, mass: 1000, };

        let body2 = { x: 500, y: 300, vx: 0, vy: -2, mass: 1000, };

        const G = 0.05;
        const damping = 0.999;

        function update() {

            context.clearRect(0,0,canvas.width, canvas.height);
            //distance
            const dx = body2.x - body1.x;
            const dy = body2.y - body1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

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

            //damping
            body1.vx *= damping;
            body1.vy *= damping;
            body2.vx *= damping;
            body2.vy *= damping;

            //update position => new position = current position + v.t
            body1.x += body1.vx; 
            body1.y += body1.vy;
            body2.x += body2.vx;
            body2.y += body2.vy;

            drawBody(body1, 'blue');
            drawBody(body2, 'red');
        }

        function drawBody(body ,color){
            context.beginPath();
            context.arc(body.x,body.y,20,0,2* Math.PI);
            context.fillStyle = color;
            context.fill();
            context.stroke();
        }

        function animate(){
            update();
            requestAnimationFrame(animate);
        }

        animate();
    }, []);



    return (<canvas ref={canvasRef} style={{border: '1px solid black'}}/>)

};

export default TwoBodySimulation
