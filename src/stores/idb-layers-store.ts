import { openDB } from 'idb/with-async-ittr.js';

export const LAYERS_STORE_KEY = 'layers';

const openLayerStore = () => {
    const dbPromise = openDB(`store_${LAYERS_STORE_KEY}_1`, 1, {
        upgrade(db) {
          db.createObjectStore(LAYERS_STORE_KEY);
        },
    });
    return dbPromise;
}

export {openLayerStore};
