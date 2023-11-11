import { IChipLayer } from "../interfaces/interfaces";

export const LAYERS_STORE_KEY = 'layers';

const openLayerStore = async () => {
    return {
      add: (nlayer: IChipLayer) => {
        const layersSTR = localStorage.getItem(LAYERS_STORE_KEY) || '[]';
        const layers = JSON.parse(layersSTR) as IChipLayer[];
        layers.push(nlayer);
        localStorage.setItem(LAYERS_STORE_KEY, JSON.stringify(layers));
      },
      remove: (layerId: string) => {
        const layersSTR = localStorage.getItem(LAYERS_STORE_KEY) || '[]';
        const layers = JSON.parse(layersSTR) as IChipLayer[];
        localStorage.setItem(LAYERS_STORE_KEY, JSON.stringify(layers.filter(layerItem=> layerItem.id === layerId)));
      },
      get : () => {
        const layers = localStorage.getItem(LAYERS_STORE_KEY) || '[]';
        return JSON.parse(layers) as IChipLayer[];
      }
    }
}

export {openLayerStore};
