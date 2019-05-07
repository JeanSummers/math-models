import RandomStream, { StreamGenerator } from "./RandomStream";

import random from 'random';


export default class PoissonGenerator implements StreamGenerator {
    lambda: number;
    generator: () => number;

    constructor(lambda: number) {
        this.lambda = lambda;
        this.generator = random.poisson(this.lambda);
    }

    generate(): number {
        return this.generator();
        let limit = Math.exp(-this.lambda);
        let prod = Math.random();
        let i;	
        for (i = 0; prod >= limit; i++)
            prod *= Math.random();
        return i;
    }

    lambdaEmpirical(stream: RandomStream) {
        return stream.data.reduce((acc, item, i) => acc + item * i) / stream.count;
    }

    chiSquared(stream: RandomStream) {
        const data = stream.data;

        const expected = this.calculateExpected(stream);

        const chi = data.map((observed, i) => (observed - expected[i])**2 / expected[i]);

        console.table(data.map((observed, i) => ({  "Ожидаемое": expected[i], "Наблюдаемое": observed, "𝛘²": chi[i] })));

        const K = chi.reduce((acc, value) => acc + value, 0);

        return K;
    }

    calculateExpected(stream: RandomStream) {
        const lambda = this.lambdaEmpirical(stream);
        const exp = Math.exp(-lambda);
        const c = stream.count * exp;

        let npi: number[] = [];
        for (let i = 0; i < stream.data.length; i++) {
            let divident = c;
            for (let fact = 1; fact <= i; fact++) {
                if (isOutOfBounds(divident)) {
                    console.warn('Value became out of bounds ', divident);  
                    divident = moveToBounds(divident);
                    break;
                }
                divident *= lambda;
                divident /= fact;
            }
            npi.push(divident);
        }
        return npi;
    }
}

function isOutOfBounds(value: number) {
    const abs = Math.abs(value);
    return abs <= Number.EPSILON || value >= Number.MAX_SAFE_INTEGER;
}

function moveToBounds(value: number) {
    const abs = Math.abs(value);
    const sign = Math.sign(value);
    if (abs <= Number.EPSILON) return sign * Number.EPSILON;
    if (abs >= Number.MAX_SAFE_INTEGER) return sign * Number.MAX_SAFE_INTEGER;
    return value;
}


        /*
        const debug = [];

        debug.push({
            divident: Math.round(divident),
            data: Math.round(data[i] / 100),
            delta: Math.round(Math.abs(divident - data[i] / 100)),
            chi: (data[i] / 100 - npi[i])**2 / npi[i]
        });

        console.table(debug);
        */