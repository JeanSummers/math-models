import Label from "@Animations/Actors/Label";
import Scenario from "@Animations/Types/Scenario";
import StreamRenderer from "./RandomStream/StreamRenderer";

import Rect from "@Animations/Shapes/Rect";
import Point from "@Animations/Shapes/Point";

import RandomStream from "./RandomStream/RandomStream";
import PoissonGenerator from "./RandomStream/PoissonGenerator";


export default class RandomStreamScenario extends Scenario {
    center: Point;
    size: Point;

    stream: RandomStream;
    renderer: StreamRenderer;

    gridDensity = 11;
    //generator = new NormalGenerator(0, 100, 1);
    generator = new PoissonGenerator(1);

    onComplete?: Function;

    constructor(canvas: HTMLCanvasElement) {
        super();

        this.stream = new RandomStream(this.generator, this.gridDensity);

        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.size = new Point(canvas.width, canvas.height);

        this.renderer = this.makeRenderer();
        
        let countLabel = this.makeCountLabel();
        let checkLabel = this.makeCheckLabel();

        this.addActions([ this.renderer, countLabel, checkLabel ]);
    }

    makeCheckLabel() {
        let label = new Label(new Point(this.size.x - 20, 20));

        label.style.text.font = "20px Arial";
        label.style.text.textAlign = 'right';

        let checked = false;
        let pearson = "";
        let self = this;
        label.addAction(function() {
            if (self.isStopped() && !checked) {
                pearson = ' | Хи-квадрат = ' + (self.generator.chiSquared(self.stream)).toFixed(3);
                checked = true;
                if (self.onComplete) self.onComplete();
            }
            let lambda = self.generator.lambdaEmpirical(self.stream);
            this.text = `Лямбда: ${lambda.toFixed(3)}${pearson}`;
        });

        return label;
    }

    makeCountLabel() {
        let label = new Label(new Point(20, 20));

        label.style.text.font = "20px Arial";

        let r = this.renderer;
        label.addAction(function() {
            this.text = `Сгенерировано чисел: ${r.stream.count}`
        });

        return label;
    }

    makeRenderer() {
        let rect = new Rect(20, 30, this.size.x - 20, this.size.y - 20);

        let renderer = new StreamRenderer(this.stream, rect);

        renderer.style.rulerSteps = 20;
        renderer.style.borderColor = 'gray';

        let self = this;
        renderer.addAction(function(time) {
            if (self.isStopped()) return;

            let speed = time.sec + 1;
            speed = speed**speed;
            let clamped = speed < 1e5 ? speed : 1e5;
            this.stream.add(Math.floor(clamped));
        })

        return renderer;
    }

    isStopped() {
        return this.stream.count >= 1e6;
    }
}