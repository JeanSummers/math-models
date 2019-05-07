import Style from "@Animations/Styles/Style";
import { Color } from "@Animations/Styles/Color";
import { TextStyle } from "@Animations/Styles/TextStyle";

export class StreamRendererStyle extends Style {
    rulerColor: Color = 'black';
    rulerText: TextStyle;
    rulerHeight = 30;
    rulerSteps = 10;

    cursorColor?: Color = 'blue';
    cursorText: TextStyle;

    graphColor: Color = 'red';
    numbersColor?: Color;
    borderColor?: Color;

    constructor() {
        super();
        this.rulerText = new TextStyle();
        this.rulerText.textAlign = 'center';
        this.rulerText.textBaseline = 'top';

        this.cursorText = new TextStyle();
        this.cursorText.textBaseline = 'middle';
    }
}