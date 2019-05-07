import Point from "@Animations/Shapes/Point";
import { grayscale } from "@Animations/Common/ColorLiterals";
import { Color } from "@Animations/Styles/Color";


export type ValueConverter = (value: number) => Color;

export default class MatrixDrawer {

    private ctx: CanvasRenderingContext2D;
    private matrix: number[][];

    private ratio: Point;

    constructor(ctx: CanvasRenderingContext2D, matrix: number[][]) {
        this.ctx = ctx;
        this.matrix = matrix;

        this.ratio = new Point(
            ctx.canvas.width / matrix.length,
            ctx.canvas.height / matrix[0].length
        );
        
        if (this.ratio.x < 1 || this.ratio.y < 1)
            console.warn(
                'Matrix dimensions higher than canvas resolution.' + 
                'This may lead to bad quality image');
    }

    draw(valueToColor: ValueConverter = grayscale) {
        let position = new Point(0, 0);
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                position.x = i * this.ratio.x;
                position.y = j * this.ratio.y;
                let color = valueToColor(this.matrix[i][j]);
                this.drawPixel(position, color);
            }
        }
    }
    
    private drawPixel(position: Point, color: Color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            Math.round(position.x), Math.round(position.y), 
            Math.ceil(this.ratio.x), Math.ceil(this.ratio.y));
    }
}