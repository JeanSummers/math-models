import Point from "@Animations/Shapes/Point";
import { BoundaryConditions, Condition } from "./BoundaryConditions";

const methods = {
    five: (u: number[][], i: number, j: number) => (
        u[i + 1][j] + 
        u[i - 1][j] + 
        u[i][j + 1] + 
        u[i][j - 1]
    ) / 4,
    nine: (u: number[][], i: number, j: number) => (
        u[i + 1][j + 1] + 
        u[i - 1][j + 1] + 
        u[i - 1][j - 1] +
        u[i + 1][j - 1] + 
        4 * (
            u[i + 1][j] + 
            u[i - 1][j] + 
            u[i][j + 1] + 
            u[i][j - 1]
        )
    ) / 20
}

const sin = (value: number) => Math.sin(Math.PI * value);
const poly = (value: number) => 4 * value * (1 - value); // 0 + 4*value - 4*value**2
const linear = (value: number) => value;

function inSquare(point: Point, size: number, side: number) {
    let center = size / 2;
    let left = center - side / 2;
    let right = center + side / 2;

    return (point.x > left && point.x < right) && 
           (point.y > left && point.y < right) 
}

function inCircle(point: Point, size: number, radius: number) {
    return point.dist(new Point(size / 2, size / 2)) < radius;
}

// TODO: Make separate class
const bounds = [
    (point: Point, size: number) => (point.y == 0) ? sin(point.x / size) : undefined,
    (point: Point, size: number) => (point.x == 0) ? poly(point.y / size) : undefined,
    (point: Point, size: number) => (point.y == size - 1) ? linear(point.x / size) : undefined,
    (point: Point, size: number) => (point.x == size - 1) ? linear(point.y / size) : undefined,
    (point: Point, size: number) => inCircle(point, size, size / 5) ? -1 : undefined,
    //(point: Point, size: number) => inSquare(point, size, size / 5) ? 1 : undefined,
];

type MethodName = keyof typeof methods;
type SolverSettings = {
    size: number,
    precision?: number, 
    method?: MethodName
};

export default class HeatDistribution {
    w: number = 1.25;
    
    plate: number[][];
    precision: number;

    method: typeof methods.five;

    conditions: BoundaryConditions;

    constructor({ size, precision = 1e-6, method = 'nine' }: SolverSettings) {
        this.precision = precision;
        this.method = methods[method];
        this.plate = this.makePlate(size);

        this.conditions = new BoundaryConditions(size);
    }

    makePlate(length: number) {
        const plate: number[][] = [];
    
        for(let i = 0; i < length; i++) {
            let row: number[] = [];
            row.length = length;
            row.fill(0);
    
            plate.push(row);
        }

        return plate;
    }

    setBoundaryConditions(conditions: Condition[]) {
        this.conditions.setConditions(conditions);

        for (let i = 0; i < this.plate.length; i++) {
            for (let j = 0; j < this.plate[i].length; j++) {
                let value = this.conditions.getValue(new Point(i, j));
                if (value !== false)
                    this.plate[i][j] = value;
            }
        }
    }
    
    calculate() {
        let delta;
        do {
            delta = this.iteration();
        } while(delta >= this.precision)
    }

    private iteration() {
        let delta = 0;
        for (let i = 1; i < this.plate.length - 1; i++)
            for (let j = 1; j < this.plate[i].length - 1; j++)
                if (!this.conditions.isBound(new Point(i, j)))
                    delta = this.step(i, j, delta);
        return delta;
    }
    
    step(i: number, j: number, delta: number) {
        let schema = this.method(this.plate, i, j);
    
        if (Number.isNaN(schema)) 
            throw new Error('NaN value in calculation');
    
        let abs = Math.abs(schema - this.plate[i][j]);
        let max = Math.max(abs, delta);
    
        this.plate[i][j] = schema * this.w + (1 - this.w) * this.plate[i][j];

        return max;
    }

}