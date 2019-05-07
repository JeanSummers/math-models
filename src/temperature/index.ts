import MatrixDrawer from "./MatrixDrawer";
import HeatDistribution from "./Distribution";
import { Gradient } from "./Gradient";
import { BoundaryConditions } from "./BoundaryConditions";

main();

function main() {
    const canvas = getCanvas('screen');

    const ctx = getContext(canvas);

    const distribution = new HeatDistribution({ 
        size: 100,
        precision: 1e-6
    });

    setBoundaryConditions(distribution);

    drawResult(ctx, distribution.plate);

    setTimeout(() => {
        distribution.calculate();
        drawResult(ctx, distribution.plate);
    }, 0);
}

function setBoundaryConditions(distribution: HeatDistribution) {
    const { 
        leftBound, rightBound, 
        upperBound, lowerBound, 
        inCircle, inSquare } = BoundaryConditions.checks;

    const {
        sin, polynome
    } = BoundaryConditions.rules;

    distribution.setBoundaryConditions([
        { when: leftBound, put: polynome(0, 4, -4) },
        { when: rightBound, put: polynome(0, 1) },
        { when: upperBound, put: sin },
        { when: lowerBound, put: polynome(0, 1) },
        { when: inCircle(0.2), put: polynome(1) },
    ])
}

function drawResult(ctx: CanvasRenderingContext2D, result: number[][]) {
    const valueToColor = makeValueConverter(result);

    new MatrixDrawer(ctx, result).draw(valueToColor);
}

function makeValueConverter(matrix: number[][]) {
    const { min, max } = getMinMax(matrix);

    const length = max - min;

    const gradient = new Gradient({
        0.0: 'blue',
        0.25: 'cyan',
        0.5: 'lime',
        0.75: 'yellow',
        1.0: 'red'
    });

    return function(value: number) {
        return gradient.color((value - min) / length);
    }
}

function getMinMax(matrix: number[][]) {
    let min = Infinity;
    let max = -Infinity;

    for (let row of matrix) {
        let minCandidate = Math.min(...row);
        let maxCandidate = Math.max(...row);

        if (min > minCandidate)
            min = minCandidate;
        if (max < maxCandidate)
            max = maxCandidate;
    }

    return { min, max }
}


function getCanvas(id: string) {
    const canvas = document.getElementById(id);

    if (!canvas || !(canvas instanceof HTMLCanvasElement))
        throw new Error(`Canvas with id ${id} does not found`);

    return canvas;
}

function getContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');

    if (!ctx)
        throw new Error(`Unable to retrieve context 2d from canvas element`);

    return ctx;
}