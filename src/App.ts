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
    private balls: Ball[];
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
        this.balls = [
            {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0
            },
            {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0
            }
        ]

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
        if (t - this.lastT > 300) {
            // if browser inactive, or heavily slowed, slow animation
            this.lastT = t;
        }
        const dt = (t - this.lastT) / 1000;
        this.lastT = t;

        for (let ball of this.balls) {
            ball.dy += dt * this.g;
            const newX = ball.x + dt * ball.dx;
            const newY = ball.y + dt * ball.dy;
            const previousDistance = Math.sqrt(ball.x * ball.x + ball.y * ball.y);
            const newDistance = Math.sqrt(newX * newX + newY * newY);
            if (newDistance > 1) {
                const beforeEdge = 1 - previousDistance;
                const totalDistance = newDistance - previousDistance;
                const fraction = beforeEdge / totalDistance;
                const dtBefore = dt * fraction;
                ball.x += dtBefore * ball.dx;
                ball.y += dtBefore * ball.dy;
                // at edge

                // bounce
                const reflectAcross = Math.atan2(ball.y, ball.x);
                const ballAngle = Math.atan2(ball.dy, ball.dx);
                const newAngle = reflectAcross + (reflectAcross - ballAngle);
                const oldMagnitude = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                ball.dx = -Math.cos(newAngle) * oldMagnitude;
                ball.dy = -Math.sin(newAngle) * oldMagnitude;

                // finish dt
                const dtAfter = dt - dtBefore;
                ball.x += dtAfter * ball.dx;
                ball.y += dtAfter * ball.dy;
            }
            else {  // no bounce
                ball.x = newX;
                ball.y = newY;
            }
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const g = Math.abs(Math.floor(t / 10) % 510 - 255);
        this.context.fillStyle = `rgb(128, ${g}, 192)`;

        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4375;

        for (let ball of this.balls) {
            const x = radius * ball.x + this.canvas.width / 2;
            const y = radius * ball.y + this.canvas.height / 2;
            this.context.beginPath();
            this.context.ellipse(x, y, 10, 10, 0, 0, 6.2832);
            this.context.fill();
        }

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
