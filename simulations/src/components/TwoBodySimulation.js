import React, {useEffect } from 'react'

const TwoBodySimulation = () => {
   
    useEffect(() => {
        let body1 = {x: 300,y: 300,vx: 0,vy: 2,mass: 1000,};

        let body2 = {x: 500,y: 300,vx: 0,vy: -2,mass: 1000,}
    }, []);



    return (<div></div>)
}

export default TwoBodySimulation
