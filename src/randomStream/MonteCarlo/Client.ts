import Timer from "./Timer";

export default class ClientSource {
    public get progress() : number {
        return this.timer.progress;
    }
    
    private generator: () => number;
    private timer: Timer;

    constructor(generator: () => number, step: number) {
        this.generator = generator;
        this.timer = new Timer(step);
    }

    async waitClient() {
        const time = this.generator();
        await this.timer.wait(time);
    }
}