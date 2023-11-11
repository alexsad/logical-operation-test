import React from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import arrowLeftIcon from '../../ui/assets/arrows_move_prev.png';
import floppyDiskIcon from '../../ui/assets/save.png';
import trashIcon from '../../ui/assets/trash.png';
import colors from '../../ui/colors';
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
    width: 1.5rem;
    height: 1.5rem;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 50%;
    cursor: pointer;
    filter: invert(1);
    background-size: contain;
`;

const RemoveBtn = styled(btn)`
    background-image: url(${trashIcon});
    margin-left: 1rem;
`;

const SaveBtn = styled(btn)`
    background-image: url(${floppyDiskIcon});
`;

const RollbackBtn = styled(btn)`
    background-image: url(${arrowLeftIcon});
`;

const LayerOperations: React.FC = () => {
    const { layers, activeLayerId } = useChipLayers();
    const activeLayer = layers.find(({ id }) => activeLayerId === id);
    const isEditableMode = !!activeLayer && activeLayer?.version === 0;
    const isViewMode = !isEditableMode && !!activeLayer && activeLayer.version > 0;

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

    const onRepublish = async () => {
        const { updateLayer, getLayer } = useChipLayer.getState();
        const { publishNewLayerVersion } = useChipLayers.getState();
        const layer = getLayer();
        if (!!layer) {
            const publishedLayer = await publishNewLayerVersion(layer);
            updateLayer(publishedLayer);
        }
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

    const onRemove = async () => {
        const { removeLayer } = useChipLayers.getState();
        removeLayer(activeLayerId);
        rollbackToDraft();
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
            {!!isViewMode && (
                <RollbackBtn onClick={rollbackToDraft} />
            )}
            <LayerTitle>
                {!!isEditableMode && (
                    <input
                        placeholder="Input the chip name"
                        type="text"
                        defaultValue={activeLayer?.name}
                        maxLength={15}
                        onInput={onChangeNameHandler}
                    />
                )}
                {!!isViewMode && (
                    <label>{activeLayer.name}-{activeLayer.version}</label>
                )}
            </LayerTitle>
            {!!isViewMode && (
                <>
                    <SaveBtn onClick={onRepublish} />
                    <RemoveBtn onClick={onRemove} />
                </>
            )}
            {!!isEditableMode && (
                <SaveBtn onClick={onPublish} />
            )}
        </LayerOperationsWrap>
    )
}

export default LayerOperations;