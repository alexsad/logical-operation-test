import React from 'react';
import styled from 'styled-components';
import { IChip } from '../../interfaces/interfaces';
import TabContainer from '../TabContainer';
import { ChipPreview } from '../chip/Chip';
import useChipLayers from '../stores/useChipLayers';
import colors from '../../ui/colors';

const ToolSetWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    // border: 1px solid blue;
    height: calc(100vh - 16rem);

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
        height: 100%;
        background: rgb(1,106,234);
        background: radial-gradient(circle, rgba(1,106,234,1) 0%, rgba(0,25,65,1) 100%);         

        > * {
            padding: .5rem;
            margin: 5px;
            border:2px solid transparent;
            border-radius: .5rem;
        }

        > :hover{
            border:2px solid ${colors['blue.200']};
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
                    label: 'in',
                }
            ],
            outputs: [
                {
                    id: 'not',
                    active: false,
                    label: 'out',
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
                    id: 'in_1',
                    active: false,
                    label: 'in_1',
                },
                {
                    id: 'in_2',
                    active: false,
                    label: 'in_2',
                },
            ],
            outputs: [
                {
                    id: 'and',
                    active: false,
                    label: 'out',
                }
            ],
            position: { x: 0, y: 0},
            originLayerId: 'and',
            instInputDeps:[],
        },
        {
            id: 'binary_display',
            name: 'binary_display',
            version: 1,
            inputs: [
                {
                    id: 'in_1',
                    active: false,
                    label: 'in_1',
                },
                {
                    id: 'in_2',
                    active: false,
                    label: 'in_2',
                },
                {
                    id: 'in_3',
                    active: false,
                    label: 'in_3',
                },
                {
                    id: 'in_4',
                    active: false,
                    label: 'in_4',
                },
            ],
            outputs: [
                {
                    id: 'out_1',
                    active: false,
                    label: 'out_1',
                },
                {
                    id: 'out_2',
                    active: false,
                    label: 'out_2',
                },
                {
                    id: 'out_3',
                    active: false,
                    label: 'out_3',
                },
                {
                    id: 'out_4',
                    active: false,
                    label: 'out_4',
                },
            ],
            position: { x: 0, y: 0},
            originLayerId: 'binary_display',
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