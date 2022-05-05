import React from 'react';
import styled from 'styled-components';
import TabContainer from '../TabContainer';
import useChipLayers from '../stores/useChipLayers';
import { debounce } from '../../util/debounce';

const LayersWrap = styled.div`
    background-color: #fff;
    overflow: auto;
    width: 100%;
    box-sizing: border-box;
`;

const LayersTitle = styled.div`
    width: calc(100% - 0.8rem);
    float: left;
    margin: 0.2rem;
    padding: 0.2rem;
    position: relative;
    color: rgb(78, 78, 78);
    text-align: left;
    font-size: 12px;
`;

const LayerRow = styled.div`
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

    &:hover{
        background-color: #ffffff;
        border: 1px dotted #999999;
    }
    &.is-selected{
        background-color: #b7deea;
    }

    > input[type=text] {
        width: 110px;
    }
`;

const Layers: React.FC = () => {
    const {layers, setVisibility, publishLayer, changeLayerName} = useChipLayers();
    const changeLayerVisibility = (layerId: string) => ({target}:React.ChangeEvent<HTMLInputElement>) => {
        setVisibility(layerId, target.checked);
    }

    const onChangeNameHandler = (layerId: string) => ({target}:React.ChangeEvent<HTMLInputElement>) => {
        changeLayerName(layerId, target.value);
    }

    return (
        <TabContainer title="Layers" tabTitle="Layers">
            <LayersWrap>
                <LayersTitle>
                    <label>Visible?</label>
                </LayersTitle>
                {layers.map(layer => (
                    <LayerRow key={`${layer.id}`}>
                        <input checked={layer.visible} type="checkbox" onChange={changeLayerVisibility(layer.id)} />
                        {layer.version === 0 && (
                            <>
                                <input defaultValue={layer.name} type="text" onInput={debounce<React.ChangeEvent<HTMLInputElement>>(onChangeNameHandler(layer.id), 1000)} />
                                <button onClick={() => publishLayer(layer.id)}>publish</button>
                            </>
                        )}
                        {layer.version > 0 && (
                            <label>{layer.name}-{layer.version}</label>
                        )}
                    </LayerRow>
                ))}
            </LayersWrap>   
        </TabContainer>

    );
}

export default Layers;