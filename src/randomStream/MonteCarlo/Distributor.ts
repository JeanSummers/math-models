import Servant from "./Servant";
import ClientSource from "./Client";

export default class Distributor {
    public servants: Servant[];
    public clients: ClientSource[];

    private isRunning = false;

    constructor(servants: Servant[], clients: ClientSource[]) {
        if (servants.length == 0) throw new Error('Empty array of servants');
        this.servants = servants;
        if (clients.length == 0) throw new Error('Empty array of clients');
        this.clients = clients;
    }

    public start() {
        if (this.isRunning) return;

        this.isRunning = true;        
        for (let client of this.clients) {
            const callback = () => {
                if (!this.isRunning) return;
                this.addClient();
                client.waitClient().then(callback);
            }
            client.waitClient().then(callback);
        }
    }

    public stop() {
        this.isRunning = false;
    }

    public addClient() {
        this.servants.sort((a, b) => a.clientCount - b.clientCount);
        this.servants[0].addClient();
    }
}