class Body {
    constructor(mass, x, y, vx, vy, color) {
        this.mass = mass;  
        this.x = x;        
        this.y = y;        
        this.vx = vx;      
        this.vy = vy;      
        this.color = color;
    }
}
const bodies = [
    [
        new Body(5, 0, 0, 1, 1, 'red'),   // Body 1
        new Body(3, 1, 1, 2, 2, 'green'), // Body 2
        new Body(1, 2, 2, 3, 3, 'blue')   // Body 3
    ],
    [],
    []
];
