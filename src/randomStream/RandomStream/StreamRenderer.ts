import Actor from "@Animations/Types/Actor";
import { StreamRendererStyle } from "./StreamRendererStyle";
import RandomStream from "./RandomStream";
import Rect from "@Animations/Shapes/Rect";
import Point from "@Animations/Shapes/Point";

export default class StreamRenderer extends Actor {
    style  = new StreamRendererStyle();
    stream: RandomStream;
    rect: Rect;

    constructor(stream: RandomStream, rect: Rect)  {
        super();

        this.stream = stream;
        this.rect = rect;
    }
    
    draw(ctx: CanvasRenderingContext2D): void {
        this.updateUsefulValues();

        this.drawGraph(ctx);
        this.drawRuler(ctx);
        this.drawBorder(ctx);
    }
    
    size = new Point(0, 0);
    ratio = new Point(0, 0);
    min = 0;
    max = 0;
    updateUsefulValues() {
        this.size = this.rect.size();

        this.min = Math.min(...this.stream.data);
        this.max = Math.max(...this.stream.data);
        
        this.ratio.x = this.size.x / (this.stream.data.length - 1);
        this.ratio.y = (this.size.y - this.style.rulerHeight) / (this.max - this.min);
    }

    drawBorder(ctx: CanvasRenderingContext2D) {
        if (!this.style.borderColor)
            return;

        ctx.strokeStyle = this.style.borderColor
        ctx.strokeRect(this.rect.x1, this.rect.y1, this.size.x, this.size.y);
    }

    drawRuler(ctx: CanvasRenderingContext2D) {
        let baseline =  this.rect.y2 - Math.round(this.style.rulerHeight / 2);
        let top = this.rect.y2 - Math.round(this.style.rulerHeight / 4 * 3);

        ctx.strokeStyle = this.style.rulerColor;
        ctx.fillStyle = this.style.numbersColor || this.style.rulerColor;

        this.style.rulerText.applyToContext(ctx);

        ctx.beginPath();
        ctx.moveTo(this.graphX(0), baseline);
        ctx.lineTo(this.graphX(this.stream.data.length - 1), baseline);
        ctx.stroke();

        let segment = this.stream.data.length / (this.style.rulerSteps);
        for (let i = 1; i < this.style.rulerSteps; i++) {
            let index = Math.floor(segment * i);
            let x = this.graphX(index);

            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, baseline);
            ctx.stroke();

            ctx.fillText(index.toString(), x, baseline + 2);
        }
    }

    drawGraph(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.style.graphColor;

        ctx.beginPath();
        ctx.moveTo(this.graphX(0), this.graphY(0));
        for (let i = 0; i < this.stream.data.length; i++)
            ctx.lineTo(this.graphX(i), this.graphY(i));
        ctx.stroke();
    }

    graphX(i: number) {
        return this.rect.x1 + i * this.ratio.x;
    }

    graphY(i: number) {
        let data = (this.stream.data[i] - this.min) * this.ratio.y;

        return this.rect.y2 - this.style.rulerHeight - data;
    }
}