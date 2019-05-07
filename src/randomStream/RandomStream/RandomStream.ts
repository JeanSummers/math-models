export default class RandomStream {
    data: number[];
    count = 0;
    generator: StreamGenerator;

    constructor(generator: StreamGenerator, count: number) {
        this.generator = generator;
        this.data = new Array(count);
        this.data.fill(0);
    }

    add(count: number) {
        while(count--) {
            let number = this.generator.generate();
            if (!Number.isInteger(number))
                number = Math.round(number);
            if (number < 0 || number >= this.data.length)
                continue;
            this.data[number]++;
            this.count++;
        }
    }
}

export interface StreamGenerator {
    generate(): number;
}