import React from 'react';
import styled from 'styled-components';
import { IChip } from '../../interfaces/interfaces';
import TabContainer from '../TabContainer';
import { ChipPreview } from '../chip/Chip';
import useChipLayers from '../stores/useChipLayers';

const ToolSetWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    // border: 1px solid blue;
    height: calc(100vh - 4.6rem);

    > .tool-set-options{
        width: 100%;
        background-color: #fff;
        padding: 0.6rem;
        box-sizing: border-box;
        color: #000;
    }

    > .tool-set-box{
        width: 100%;
        flex-grow: 1;
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: center;
        background-color: lightgrey;
        // border: 1px solid red;
        overflow-y: auto;

        > * {
            margin: 5px;
        }

        > :hover{
            background-color: #4d4d4ddd;
        }

        > .is-selected{
            background-color: #ebff99;
        }
    }
`;

const ToolSet: React.FC = () => {
    const {layers} = useChipLayers();

    const publishedLayer:IChip[] = layers
        .filter(layer => layer.version > 0 && layer.id && !layer.visible)
        .map(layer => {
            return {
                id: layer.id,
                name: layer.name,
                version: layer.version,
                instInputDeps: [],
                inputs: [
                    ...layer.inputs                    
                ],
                outputs: [
                    ...layer.outputs
                ],
                position: { x: 0, y: 0},
                originLayerId: layer.id,
            }
        })



    const chips: IChip[] = [
        {
            id: 'not',
            name: 'not',
            version: 1,
            inputs: [
                {
                    id: 'not',
                    active: false,
                }
            ],
            outputs: [
                {
                    id: 'not',
                    active: false,
                }
            ],
            position: { x: 0, y: 0},
            originLayerId: 'not',
            instInputDeps: [],
        },
        {
            id: 'and',
            name: 'and',
            version: 1,
            inputs: [
                {
                    id: 'and_in_1',
                    active: false,
                },
                {
                    id: 'and_in_2',
                    active: false,
                },
            ],
            outputs: [
                {
                    id: 'and',
                    active: false,
                }
            ],
            position: { x: 0, y: 0},
            originLayerId: 'and',
            instInputDeps:[],
        },
        ...publishedLayer,
    ];

    return (
        <TabContainer title="Tools" tabTitle="Chips">
            <ToolSetWrap>
                <div className="tool-set-box">
                    {chips.map(chip => <ChipPreview key={chip.id} {...chip}/>)}
                </div>
            </ToolSetWrap>
        </TabContainer>
    );
}

export default ToolSet;