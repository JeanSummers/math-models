export default class Timer {
    public progress = -1;
    private step: number;

    constructor(step: number) {
        this.step = step;
    }

    async wait(time: number) {
        this.progress = time;
        while(this.progress--) {
            await timeout(this.step);
        }
    }
}

function timeout(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}