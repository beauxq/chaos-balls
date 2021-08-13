interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

class App {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private lastT: number;
    private ball: Ball;
    private readonly g: number = 9.8;

    constructor(width: number, height: number) {
        this.canvas = document.getElementById('c') as HTMLCanvasElement;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d')!;

        this.canvas.addEventListener('click', (e) => {
            console.log(`click: ${e.x} ${e.y}`);
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log(`right click: ${e.x} ${e.y}`);
        });
        this.canvas.addEventListener('wheel', (e) => {
            const down = e.deltaY > 0;
            const x = e.offsetX;
            const y = e.offsetY;
            
            console.log(`wheel event:  offsetX ${x}  offsetY ${y}  down ${down}`);
        });

        this.lastT = 0;
        this.ball = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        }

        requestAnimationFrame((t) => {
            this.draw(t);
        });
    }

    public resize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d')!;
    }

    private draw(t: number) {
        if (this.lastT === 0) {
            this.lastT = t;
        }
        const dt = (t - this.lastT) / 1000;
        this.lastT = t;

        this.ball.dy += dt * this.g;
        const newX = this.ball.x + dt * this.ball.dx;
        const newY = this.ball.y + dt * this.ball.dy;
        const previousDistance = Math.sqrt(this.ball.x * this.ball.x + this.ball.y * this.ball.y);
        const newDistance = Math.sqrt(newX * newX + newY * newY);
        if (newDistance > 1) {
            const beforeEdge = 1 - previousDistance;
            const totalDistance = newDistance - previousDistance;
            const fraction = beforeEdge / totalDistance;
            const dtBefore = dt * fraction;
            this.ball.x += dtBefore * this.ball.dx;
            this.ball.y += dtBefore * this.ball.dy;
            // at edge

            // bounce
            const reflectAcross = Math.atan2(this.ball.y, this.ball.x);
            const ballAngle = Math.atan2(this.ball.dy, this.ball.dx);
            const newAngle = reflectAcross + (reflectAcross - ballAngle);
            const oldMagnitude = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
            this.ball.dx = -Math.cos(newAngle) * oldMagnitude;
            this.ball.dy = -Math.sin(newAngle) * oldMagnitude;

            // finish dt
            const dtAfter = dt - dtBefore;
            this.ball.x += dtAfter * this.ball.dx;
            this.ball.y += dtAfter * this.ball.dy;
        }
        else {  // no bounce
            this.ball.x = newX;
            this.ball.y = newY;
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const g = Math.abs(Math.floor(t / 10) % 510 - 255);
        this.context.fillStyle = `rgb(128, ${g}, 192)`;

        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4375;
        const x = radius * this.ball.x + this.canvas.width / 2;
        const y = radius * this.ball.y + this.canvas.height / 2;
        this.context.beginPath();
        this.context.ellipse(x, y, 10, 10, 0, 0, 6.2832);
        this.context.fill();

        // draw container circle
        this.context.fillStyle = "rgb(192, 128, 128)";
        this.context.beginPath();
        this.context.ellipse(
            this.canvas.width / 2,
            this.canvas.height / 2,
            radius + 10,
            radius + 10,
            0, 0, 6.2832
        );
        this.context.stroke();

        requestAnimationFrame((t) => {
            this.draw(t);
        });
    }
}

export default App;
