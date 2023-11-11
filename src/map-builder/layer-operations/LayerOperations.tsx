import React from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import colors from '../../ui/colors';
import arrowLeftIcon from '../assets/arrow-left-white.png';
import floppyDiskIcon from '../assets/floppydiskmono_105949_white.png';
import fullScreen from '../assets/fullscreen.png';
import trashIcon from '../assets/trash-10-16.png';
import useChipLayer from '../stores/useChipLayer';
import useChipLayers from '../stores/useChipLayers';
import useResolution from '../stores/useResolution';

const LayerOperationsWrap = styled.div`
    background-color: #ffffff38;
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
    > input[type=text] {
        width: calc(100% - 15px);
        &::placeholder {
            color: ${colors['blue.200']};
            opacity: 1;
        }
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

const AdjustScreenBtn = styled(btn)`
    background-image: url(${fullScreen});
    background-size: 16px 16px;
`;



const LayerOperations: React.FC = () => {
    const { layers, activeLayerId } = useChipLayers();
    const activeLayer = layers.find(({ id }) => activeLayerId === id);

    const onPublish = async () => {
        const { resolution } = useResolution.getState();
        const { publishLayer, getNewLayer, addLayer, setActiveLayerId } = useChipLayers.getState();
        const layer = useChipLayer.getState();
        if (layer.name.trim().length < 2) {
            return;
        }
        await publishLayer(layer);
        const nLayer = getNewLayer();
        nLayer.resolution = { ...resolution };
        addLayer(nLayer);
        setActiveLayerId(nLayer.id);
        useChipLayer.getState().updateLayer(nLayer);
    }

    const onRepublish = async (idLayer: string) => {
        const { updateLayer, getLayer } = useChipLayer.getState();
        const { publishNewLayerVersion } = useChipLayers.getState();
        const layer = getLayer();
        if (!!layer) {
            const publishedLayer = await publishNewLayerVersion(layer);
            updateLayer(publishedLayer);
        }
    }

    const onRemove = async (idLayer: string) => {
        const { removeLayer } = useChipLayers.getState();
        removeLayer(idLayer);
    }

    const rollbackToDraft = async () => {
        const { updateLayer } = useChipLayer.getState();
        const { layers, setActiveLayerId } = useChipLayers.getState();
        const draftLayer = layers[layers.length - 1];
        if (!!draftLayer) {
            setActiveLayerId(draftLayer.id);
            updateLayer(draftLayer);
        }
    }

    const adjustResolution = () => {
        const { resolution } = useResolution.getState();
        const { getLayer, setResolution } = useChipLayer.getState();
        const { updateLayer } = useChipLayers.getState();
        const layer = getLayer();
        layer.resolution = { ...resolution };
        setResolution({ ...resolution });
        updateLayer(layer);
        setTimeout(() => {
            globalThis.dispatchEvent(
                new CustomEvent('chip:move', {})
            );
        }, 1000);
    }

    const debounceChangeChipName = useDebouncedCallback(async (value) => {
        const layer = await useChipLayer.getState().changeLayerName(value);
        useChipLayers.getState().updateLayer(layer);
    }, 500);

    const onChangeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        debounceChangeChipName(event.target.value);
    }

    return (
        <LayerOperationsWrap>
            {!!activeLayer && activeLayer.version > 0 && (
                <RollbackBtn onClick={rollbackToDraft} />
            )}
            <LayerTitle>
                {!!activeLayer && activeLayer?.version === 0 && (
                    <input
                        placeholder="Input the chip name"
                        type="text"
                        defaultValue={activeLayer?.name}
                        maxLength={15}
                        onInput={onChangeNameHandler}
                    />
                )}
                {!!activeLayer && activeLayer.version > 0 && (
                    <label>{activeLayer.name}-{activeLayer.version}</label>
                )}
            </LayerTitle>
            <AdjustScreenBtn onClick={adjustResolution} />
            {!!activeLayer && activeLayer?.version > 0 && (
                <>
                    <SaveBtn onClick={() => onRepublish(activeLayer.id)} />
                    <RemoveBtn onClick={() => onRemove(activeLayer.id)} />
                </>
            )}
            {!!activeLayer && activeLayer?.version === 0 && (
                <SaveBtn onClick={() => onPublish()} />
            )}
        </LayerOperationsWrap>
    )
}

export default LayerOperations;