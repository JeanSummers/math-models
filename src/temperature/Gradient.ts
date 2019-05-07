export class Gradient {
    private raw: Uint8ClampedArray;

    constructor(colorStops: { [key: number]: string, }, density = 256) {
        this.raw = rawGradient(colorStops, density);
    }

    color(level: number) {
        let i = this.colorPosition(level);
        return `rgb(${this.raw[i]},${this.raw[i + 1]},${this.raw[i + 2]})`;
    }

    private colorPosition(level: number) {
        return 4 * Math.round(level * (this.raw.length / 4 - 1))
    }
}

function rawGradient(colorStops: { [key: number]: string }, density: number) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const gradient = ctx.createLinearGradient(0, 0, 0, density);

    canvas.width = 1;
    canvas.height = density;

    for (let stop in colorStops)
        gradient.addColorStop(+stop, colorStops[stop]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, density);

    const uint8 = ctx.getImageData(0, 0, 1, density).data;

    return uint8;
}