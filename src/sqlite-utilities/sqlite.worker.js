import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import Worker from '../index.worker.js'

const init = () => {
    let worker = new Worker(new URL('../index.worker.js', import.meta.url));
    initBackend(worker);
}

export default init;