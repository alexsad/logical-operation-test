import React from 'react';
import styled from 'styled-components';
import TabContainer from '../TabContainer';
import useChipLayers from '../stores/useChipLayers';
import { debounce } from '../../util/debounce';
import useChipLayer from '../stores/useChipLayer';
import trashIcon from '../assets/trash-10-16.png';

const RemoveBtn = styled.div`
    width: 2rem;
    height: 2rem;
    background-image: url(${trashIcon});
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 50%;
    cursor: pointer;
`;

const LayersWrap = styled.div`
    background-color: #fff;
    overflow: auto;
    width: 100%;
    box-sizing: border-box;
`;

interface RowProps {
    isSelected: boolean;
}

const LayerRow = styled.div<RowProps>`
    background-color: ${({isSelected}) => isSelected ? '#b7deea' : 'transparent'};
    width: calc(100% - 1rem);
    float: left;
    margin: 0.2rem;
    padding: 0.2rem;
    position: relative;
    border: 1px dotted #ffffff;
    color: rgb(78, 78, 78);
    text-align: left;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    &:hover{
        border: 1px dotted #999999;
    }
    > input[type=text] {
        width: 110px;
    }
`;

const LayerName = styled.label`
    width: 110px;
`;

const Layers: React.FC = () => {
    const {layers, activeLayerId} = useChipLayers();
    const changeLayerVisibility = (layerId: string) => {
        if(activeLayerId === layerId){
            return;
        }

        const {setActiveLayerId, getActiveLayer, updateLayer: updateLayerOnLayers} = useChipLayers.getState();

        const {updateLayer, getLayer} = useChipLayer.getState();
        const layer = getLayer();
        if(layer.version < 1){
            updateLayerOnLayers(layer);
        }
        setActiveLayerId(layerId);
        const activeLayer = getActiveLayer();
        if(!!activeLayer){
            updateLayer(activeLayer);
        }
    }

    const onChangeNameHandler = async ({target}:React.ChangeEvent<HTMLInputElement>) => {
        const layer = await useChipLayer.getState().changeLayerName(target.value);
        useChipLayers.getState().updateLayer(layer);
    }

    const onPublish = async () => {
        const {publishLayer, getNewLayer, addLayer, setActiveLayerId} = useChipLayers.getState();
        const layer = useChipLayer.getState();
        if(layer.name === '*' || layer.name.length < 2){
            return;
        }
        await publishLayer(layer);
        const nLayer = getNewLayer();
        addLayer(nLayer);
        useChipLayer.getState().updateLayer(nLayer);
        setActiveLayerId(nLayer.id);
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
    return (
        <TabContainer title="Layers" tabTitle="Layers">
            <LayersWrap>
                {layers.map(layer => (
                    <LayerRow key={`${layer.id}`} isSelected={layer.id === activeLayerId} onClick={() => changeLayerVisibility(layer.id)}>
                        {layer.version === 0 && (
                            <>
                                <input defaultValue={layer.name} type="text" onInput={debounce<React.ChangeEvent<HTMLInputElement>>(onChangeNameHandler, 500)} />
                                <button onClick={onPublish}>publish</button>
                            </>
                        )}
                        {layer.version > 0 && (
                            <>
                                <LayerName htmlFor={`${layer.id}`}>{layer.name}-{layer.version}</LayerName>
                                <button onClick={() => onRepublish(layer.id)}>republish</button>
                                <RemoveBtn onClick={() => onRemove(layer.id)}/>
                            </>
                        )}
                    </LayerRow>
                ))}
            </LayersWrap>   
        </TabContainer>

    );
}

export default Layers;