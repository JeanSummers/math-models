import Line from "@Animations/Shapes/Line";
import Point from "@Animations/Shapes/Point";
import Vector from "@Animations/Shapes/Vector";

import FrameTime from "@Animations/Types/FrameTime";
import Scenario from "@Animations/Types/Scenario";

import CircleItem from "@Animations/Actors/CircleItem";
import VectorItem from "@Animations/Actors/VectorItem";
import Spring from "@Animations/Actors/Spring";

import { Color } from "@Animations/Styles/Color";


export default class TestScenario extends Scenario
{
    center: Point;
    size: Point;

    grab: boolean = false;
    speed: Vector = new Vector(0, 0);
    velocity: Vector = new Vector(0, 0);

    circle: CircleItem;
    lineV: VectorItem;
    lineS: VectorItem;
    springs: Spring[];

    constructor(canvas: HTMLCanvasElement) {
        super();

        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.size = new Point(canvas.width, canvas.height);


        this.circle = this.makeCircle();
        this.lineV = this.makeLine("#FD1218", this.velocity, 0.1);
        this.lineS = this.makeLine("#2BDE0F", this.speed, 10);
        this.springs = this.makeSprings();

        let drawList = [
            ...this.springs,
            this.circle,
            this.lineS,
            this.lineV,
        ];

        let actionList = [
            this.circle,
            this.lineS,
            this.lineV,
            ...this.springs,
        ];

        this.addActions(drawList, actionList);
    }


    onMouseDown(click: Point, event: MouseEvent) {
        let pos = this.circle.global;

        if (pos.dist(click) <= this.circle.shape.radius) {
            this.grab = true;
            this.speed.mul(0);
        }
    }

    onMouseMove(click: Point, event: MouseEvent) {
        if (!this.grab) return;
    
        const displace = click.delta(this.circle.shape.center);

        this.circle.displace = displace;
    }

    onMouseUp(click: Point, event: MouseEvent) {
        this.grab = false;
    }

    onMouseLeave(click: Point, event: MouseEvent) {
        this.grab = false;
    }

    makeLine(color: Color, track: Vector, scale: number) {
        const relative = new Vector(100, 200);
    
        let line = new VectorItem(relative.toLine(this.center));
        
        let circle = this.circle;

        line.addAction(function (this: VectorItem, time: FrameTime) {
            this.line.p1 = circle.global.copy();
            this.line.fromVector(track.copy().mul(scale));
        })
        
        line.style.color = color;
        line.style.path.lineWidth = 4;
    
        return line;
    }

    makeCircle() {
        const circle = new CircleItem(this.center, 100);
    
        circle.style.set({
            color: '#4523C4',
            borderColor: '#2F0FA6'
        })
    
        circle.style.border.lineWidth = 4;

        let self = this;

        circle.addAction(function (this: CircleItem, time: FrameTime) {
            if (self.grab)
                console.log(self.computeVelocities(self.springs[0], self.springs[1], self.springs[2], self.springs[3]));
    
            if (self.grab) return;
            self.updateVelocity(self.springs);
    
            let slowdown = self.speed.copy().div(100);
            
            self.speed.sub(slowdown);
    
            this.displace.add(self.speed);
        })
    
        return circle;
    }

    makeSprings() {
        let leftPos = new Point(0, this.center.y);
        let rightPos = new Point(this.size.x, this.center.y);
        let upPos = new Point(this.center.x, 0);
        let downPos = new Point(this.center.x,   this.size.y);

        let left  = this.makeSpring(leftPos, 180);
        let right = this.makeSpring(rightPos,  0);
        let up    = this.makeSpring(upPos,   -90);
        let down  = this.makeSpring(downPos,  90);
    
        return [left, right, up, down]
    }

    makeSpring(start: Point, clip: number) {
        let shape = this.circle.shape;
    
        const initial = shape.getPoint(clip);
    
        const pos = new Line(start, initial);
    
        const spring = new Spring(pos, 20);
    
        spring.style.color = '#1BC700';
        spring.style.path.lineWidth = 2;
    
        let circle = this.circle;
        spring.addAction(function(time: FrameTime) {
            this.line.p2 = initial.copy().add(circle.displace);
        });
    
        return spring;
    }

    updateVelocity(springs: Spring[]) {
        let velocity = this.computeVelocities(springs[0], springs[1], springs[2], springs[3]);
    
        this.speed.add(velocity.copy().div(2000))
    }
    
    computeVelocities(left: Spring, right: Spring, up: Spring, down: Spring) {
        let x = this.computeVelocity(10, left,   -1, 'x')
            + this.computeVelocity(10, right,  -1, 'x')
            + this.computeVelocity(10, up,      1, 'x')
            + this.computeVelocity(10, down,    1, 'x');
    
        let y = this.computeVelocity(10, left,   1, 'y')
            + this.computeVelocity(10, right,  1, 'y')
            + this.computeVelocity(10, up,    -1, 'y')
            + this.computeVelocity(10, down,  -1, 'y');
    
        this.velocity.x = x;
        this.velocity.y = y;
    
        return this.velocity;
    }
    
    computeVelocity(k: number, spring: Spring, sign: number, coord: 'x' | 'y')
    {
        let length = spring.line.length;
        let dl = length - spring.initalLength;
    
        let local = spring.line.toVector();
        let proj = local[coord] / length;
    
        return sign * k * dl * proj;
    }
}