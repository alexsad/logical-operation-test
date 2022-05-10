import React from 'react';
import styled from 'styled-components';
import useChipLayers from '../stores/useChipLayers';
import trashIcon from '../assets/trash-10-16.png';
import floppyDiskIcon from '../assets/floppydiskmono_105949_white.png';
import arrowLeftIcon from '../assets/arrow-left-white.png';
import useChipLayer from '../stores/useChipLayer';
import { debounce } from '../../util/debounce';
import colors from '../../ui/colors';

const LayerOperationsWrap = styled.div`
    background-color: ${colors['gray.100']};
    width: 100%;
    padding: .5rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    box-sizing: border-box;
    align-items: center;
`;

const LayerTitle = styled.div`
    flex-grow: 1;
    > input[type=text], label{
        color: white;
        background-color: transparent;
        border-color: transparent;
        height: 2rem;
        font-size: 2rem;
    }
`;

const btn = styled.div`
    width: 2rem;
    height: 2rem;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 50%;
    cursor: pointer;
`;

const RemoveBtn = styled(btn)`
    background-image: url(${trashIcon});
`;

const SaveBtn = styled(btn)`
    background-image: url(${floppyDiskIcon});
    background-size: 16px 16px;
`;

const RollbackBtn = styled(btn)`
    background-image: url(${arrowLeftIcon});
    background-size: 16px 16px;
`;



const LayerOperations: React.FC = () => {
    const {layers, activeLayerId} = useChipLayers();
    const activeLayer = layers.find(({id}) => activeLayerId === id);

    const onChangeNameHandler = async ({target}:React.ChangeEvent<HTMLInputElement>) => {
        const layer = await useChipLayer.getState().changeLayerName(target.value);
        useChipLayers.getState().updateLayer(layer);
    }

    const onPublish = async () => {
        const {publishLayer, getNewLayer, addLayer, setActiveLayerId} = useChipLayers.getState();
        const layer = useChipLayer.getState();
        if(layer.name === '*' || layer.name.trim().length < 2){
            return;
        }
        await publishLayer(layer);
        const nLayer = getNewLayer();
        addLayer(nLayer);
        setActiveLayerId(nLayer.id);
        useChipLayer.getState().updateLayer(nLayer);
    }

    const onRepublish = async (idLayer: string) => {
        const {updateLayer} = useChipLayer.getState();
        const {getLayerById, publishNewLayerVersion} = useChipLayers.getState();
        const layer = getLayerById(idLayer);
        if(!!layer){
            const publishedLayer = await publishNewLayerVersion(layer);
            updateLayer(publishedLayer);
        }
    }

    const onRemove = async (idLayer: string) => {
        const {removeLayer} = useChipLayers.getState();
        removeLayer(idLayer);
    }

    const rollbackToDraft = async () => {
        const {updateLayer} = useChipLayer.getState();
        const {layers, setActiveLayerId} = useChipLayers.getState();
        const draftLayer = layers[layers.length - 1];
        if(!!draftLayer){
            setActiveLayerId(draftLayer.id);
            updateLayer(draftLayer);
        }
    }

    return (
        <LayerOperationsWrap>
            {!!activeLayer && activeLayer.version > 0 && (
                <RollbackBtn onClick={rollbackToDraft}/>
            )}
            <LayerTitle>
                {!!activeLayer && activeLayer?.version === 0 && (
                    <input
                        type="text"
                        defaultValue={activeLayer?.name}
                        onInput={debounce<React.ChangeEvent<HTMLInputElement>>(onChangeNameHandler, 500)}
                    />
                )}
                {!!activeLayer && activeLayer.version > 0 && (
                    <label>{activeLayer.name}-{activeLayer.version}</label>
                )}
            </LayerTitle>
            {!!activeLayer && activeLayer?.version > 0 && (
                <>
                    <SaveBtn onClick={() => onRepublish(activeLayer.id)}/>
                    <RemoveBtn onClick={() => onRemove(activeLayer.id)}/>
                </>
            )}
            {!!activeLayer && activeLayer?.version === 0 && (
               <SaveBtn onClick={() => onPublish()}/>
            )}
        </LayerOperationsWrap>
    )
}

export default LayerOperations;