import React from 'react';
import ToolSet from './tools/ToolSet';
import ProjectProperties from './project-properties/ProjectProperties';
import styled from 'styled-components';
import buildBgEditor from './assets/bg-build.png';
import Chip from './chip/Chip';
import LineTo from './line-to/LineTo';
import useChipLayers from './stores/useChipLayers';
import Layers from './layers/Layers';
import { InputPoint, InputPointAdd, OutputPoint, OutputPointAdd } from './point/InputOutputPoint';

const BuilderWrap = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    flex-flow: row no-wrap;
    overflow: hidden;   

    > .panel-left, .panel-right{
        box-sizing: border-box;  
    }

    > .panel-left{
        width: 275px;
    }

    > .panel-right{
        float: right;
        width: 250px;
    }

    .box-stage{
        flex-grow: 1;
        box-sizing: border-box;
        background-image: url(${buildBgEditor});
        background-color: #999999;
        overflow: auto;
        position: relative;
        padding-top: 50px;

        > [data-layer-name=helper] {
            opacity: 1;
            z-index: 999;
        }
    }
`;

const InputOutputBox = styled.div`
    width: auto;
    padding: .5rem;
    box-sizing: border-box;
    background-color: rgba(0,0,0,.5);
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const InputsBox = styled(InputOutputBox)`
    left: 0;
`;

const OutputsBox = styled(InputOutputBox)`
    right: 0;
`;





const LayersRender: React.FC = () => {
    const {layers} = useChipLayers();

    return (
        <>
            <div draggable={false} className="box-stage">
                {layers.filter(layer => layer.visible).map((layer) => (
                    <React.Fragment key={`layer_key_${layer.name}`}>
                        <InputsBox>
                            {layer.inputs.map(input => (
                                <InputPoint key={`${input.id}`} active={input.active} inputPointId={input.id}/>
                            ))}
                            <InputPointAdd/>
                        </InputsBox>
                        {layer.chips.map(chip => (
                            <Chip 
                                key={`${chip.id}`}
                                {...chip}
                            />
                        ))}
                        {layer.wires.map(wire => (
                            <LineTo 
                                key={`${wire.chipOutputId}_${wire.chipInputId}`}
                                chipOutputId={wire.chipOutputId}
                                chipInputId={wire.chipInputId}
                            />
                        ))}
                        <OutputsBox>
                            {layer.outputs.map(output => (
                                <OutputPoint key={`${output.id}`} active={output.active} outputPointId={output.id}/>
                            ))}
                            <OutputPointAdd/>
                        </OutputsBox>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}

const Builder: React.FC = () => { 
    return (
        <BuilderWrap>
            <div className="panel-left">
                <Layers/>
                <ProjectProperties/>
            </div>
            <LayersRender/>
            <div className="panel-right">
                <ToolSet/>
            </div>
        </BuilderWrap>
    );
}

export default Builder;
