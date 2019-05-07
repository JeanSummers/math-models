import random from 'random';
import Servant from './MonteCarlo/Servant';
import ClientSource from './MonteCarlo/Client';
import Distributor from './MonteCarlo/Distributor';

const client = {
    count: 5,
    lambda: 5
}

const servant = {
    count: 5,
    lambda: 10
}

const simulationSpeed = 4;
const renderBars = false;


const clients: ClientSource[] = [];
const servants: Servant[] = [];
for (let i = 0; i < client.count; i++) {
    clients.push(new ClientSource(random.poisson(client.lambda), 1000 / simulationSpeed));
}
for (let i = 0; i < servant.count; i++) {
    servants.push(new Servant(random.poisson(servant.lambda), 1000 / simulationSpeed));
}

const distributor = new Distributor(servants, clients);
distributor.start();

(window as any).simulation = distributor;

interface Field {
    update(): void;
}

let render: (progress: number) => string;
if (renderBars) {
    render = (progress: number) => '\u2022'.repeat(progress);
} else {
    render = (progress: number) => progress.toString();
}

class ServantField implements Field {
    servant: Servant;
    progress: HTMLTableDataCellElement;
    clients: HTMLTableDataCellElement;

    elem: HTMLTableRowElement;

    constructor(servant: Servant) {
        this.servant = servant;
        this.progress = document.createElement('td') as HTMLTableDataCellElement;
        this.clients = document.createElement('td') as HTMLTableDataCellElement;

        this.elem = document.createElement('tr') as HTMLTableRowElement;
        this.elem.appendChild(this.clients);
        this.elem.appendChild(this.progress);
    }

    update() {
        this.progress.innerText = this.servant.progress !== -1 ? render(this.servant.progress + 1) : '-';
        this.clients.innerText = this.servant.clientCount !== 0 ? render(this.servant.clientCount) : '-';
    }
}

class ClientField implements Field {
    servant: ClientSource;
    progress: HTMLTableDataCellElement;

    elem: HTMLTableRowElement;

    constructor(servant: ClientSource) {
        this.servant = servant;
        this.progress = document.createElement('td') as HTMLTableDataCellElement;

        this.elem = document.createElement('tr') as HTMLTableRowElement;
        this.elem.appendChild(this.progress);
    }

    update() {
        this.progress.innerText = render(this.servant.progress + 1);
    }
}

const fields : Field[] = [];

function createServantTable() {
    const table = document.createElement('table') as HTMLTableElement;
    table.innerHTML = `<tr><th>Очередь</th><th>Прогресс</th></tr>`
    for (const servant of servants) {
        const field = new ServantField(servant);
        fields.push(field);
        table.appendChild(field.elem);
    }
    return table;
}

function createClientTable() {
    const table = document.createElement('table') as HTMLTableElement;
    table.innerHTML = `<tr><th>Следующий клиент через...</th></tr>`
    for (const client of clients) {
        const field = new ClientField(client);
        fields.push(field);
        table.appendChild(field.elem);
    }
    return table;
}

document.body.appendChild(createClientTable());
document.body.appendChild(createServantTable());

setInterval(() => {
    for (let field of fields) {
        field.update();
    }
}, 10)

