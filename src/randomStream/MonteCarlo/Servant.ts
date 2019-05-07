import Timer from "./Timer";

export default class Servant {
    public get progress() : number {
        return this.timer.progress;
    }
    
    public get isServing() : boolean {
        return this._isServing;
    }

    public get clientCount() : number {
        return this.clients;
    }
    
    private generator: () => number;
    private timer: Timer;
    private clients = 0;
    private _isServing = false;

    constructor(generator: () => number, step: number) {
        this.generator = generator;
        this.timer = new Timer(step);
    }

    addClient() {
        this.clients++;
        if (!this._isServing) {
            this.serve();
        }
    }

    async serve() {
        this._isServing = true;
        while(this.clients !== 0) {
            const time = this.generator();
            await this.timer.wait(time);
            this.clients--;
        }
        this._isServing = false;
    }
}