import Point, { Vector } from "@Animations/Shapes/Point";

const boundaryChecks = {
    upperBound(data: BoundaryConditions, point: Point) {
        const result = point.y === 0;
        if (result)
            data.value = point.x * data.delta;

        return result;
    },
    lowerBound(data: BoundaryConditions, point: Point) {
        const result = point.y === data.size - 1;
        if (result) 
            data.value = point.x * data.delta;
        return result;
    },
    leftBound(data: BoundaryConditions, point: Point) {
        const result = point.x === 0;
        if (result) 
            data.value = point.y * data.delta;
        return result;
    },
    rightBound(data: BoundaryConditions, point: Point) {
        const result = point.x === data.size - 1;
        if (result) 
            data.value = point.y * data.delta;
        return result;
    },
    inCircle(radius: number, position?: Point) {
        return function(data: BoundaryConditions, point: Point) {
            if (!position) position = data.center;

            const dist = point.dist(position) / data.size;
            const result = (dist <= radius);

            if (result) 
                data.value = dist * data.delta;
            return result;
        }
    },
    inSquare(side: number, position?: Point) {
        let offset = new Vector(side / 2, side / 2);

        return function(data: BoundaryConditions, point: Point) {
            if (!position) position = data.center.copy().div(data.size);

            const leftUp = position.copy().sub(offset);
            const rightDown = position.copy().add(offset);

            const result = GEQ(point, leftUp) && LEQ(point, rightDown);

            if (result) 
                data.value = side * data.delta;
            return result;
        }
    }
}

function GEQ(p1: Point, p2: Point) {
    return p1.x >= p2.x && p1.y >= p2.y;
}

function LEQ(p1: Point, p2: Point) {
    return p1.x <= p2.x && p1.y <= p2.y;
}

const boundaryRules= {
    sin(data: BoundaryConditions) {
        return Math.sin(Math.PI * data.value);
    },
    polynome(...args: number[]) {
        return function(data: BoundaryConditions) {
            let power = 0;
            let result = 0;
            for (const value of args) {
                result += (data.value ** power) * value;
                power++;
            }
            return result;
        }
    }
};

type Check = (data: BoundaryConditions, point: Point) => boolean;

type Rule = (data: BoundaryConditions) => number;

export type Condition = { when: Check, put: Rule };

export class BoundaryConditions {
    size: number;
    center: Point;
    delta: number;
    
    value: number = 0;
    conditions: Condition[] = [];


    constructor(size: number) {
        this.size = size;
        this.center = new Point(size / 2, size / 2);
        this.delta = 1 / size;
    }

    setConditions(conditions: Condition[]) {
        this.conditions = conditions;
    }

    isBound(point: Point) {
        for (let condition of this.conditions)
            if (condition.when(this, point))
                return true;
        return false;
    }

    getValue(point: Point) {
        for (let condition of this.conditions)
            if (condition.when(this, point))
                return condition.put(this);
        return false;
    }

    static checks = boundaryChecks;
    static rules = boundaryRules;
}

