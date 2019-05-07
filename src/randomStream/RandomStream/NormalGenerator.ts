import { StreamGenerator } from "./RandomStream";

export default class NormalGenerator implements StreamGenerator {
    min: number;
    max: number;
    skew: number;

    constructor(min: number, max: number, skew: number) {
        this.min = min;
        this.max = max;
        this.skew = skew;
    }

    generate(): number {
        let num: number;
        do {
            num = Math.floor(this.normal_distribution());
        } while(num < 0 || num > 100)
        return num;
    }

    normal_distribution() {
        let u = 0, v = 0;
        // Converting [0,1) to (0,1)
        while(u === 0) u = Math.random(); 
        while(v === 0) v = Math.random();

        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
        // Translate to 0 -> 1
        num = num / 10.0 + 0.5; 

        // Resample between 0 and 1 if out of range
        if (num > 1 || num < 0) 
            num = this.normal_distribution(); 

        num = Math.pow(num, this.skew); 

        // Stretch to fill range
        num *= this.max - this.min; 
        num += this.min;

        return num;
    }

}