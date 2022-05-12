import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TabContainer from '../TabContainer';
// import { IChipLayer } from '../../interfaces/interfaces';
import useChipLayers from '../stores/useChipLayers';
import useChipLayer from '../stores/useChipLayer';
import { IChipLayer } from '../../interfaces/interfaces';
import colors from '../../ui/colors';
import { ConfirmButton } from '../../ui/buttons';
import useResolution from '../stores/useResolution';

const ProjectPropertiesWrap = styled.div``;

const PropertyInputs = styled.div``;

const Row = styled.div`
    width: 97%;
    text-align: left;
    font-size: 1rem;
    float: left;
    padding: 4px;
    color: white;
    margin-top: 5px;
    display: flex;
    flex-direction: column;

    > input {
        float: left;
        color: white;
        width: 98%;
        background-color: ${colors['blue.300']};
        border: 0px solid transparent;
        border-radius: 3px;
        height: 28px;
        font-size: 1rem;
        margin-top:.2rem;
    }
`;

interface IProjectStructure {
    projectName: string,
    layers: IChipLayer[],
}

const ProjectProperties: React.FC =  () => {
    const [projectName, setProjectName] = useState('my-project');
    const resolution = useResolution(state => state.resolution);

    const updateProjectName = ({target}:React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(target.value);
    }

    const downloadProject = () => {
        const layers = useChipLayers.getState().layers.filter(layer => layer.version > 0);
        const projectStructure: IProjectStructure = {
            layers,
            projectName,
        }
        const projectStr = JSON.stringify(projectStructure);
        const element = document.createElement("a");
        const file = new Blob([projectStr], {type: 'text/json'});
        element.href = URL.createObjectURL(file);
        element.download = `${projectName}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const uploadFileHandler = ({target}:React.ChangeEvent<HTMLInputElement>) => {
		if(!window["FileReader"]){
			return;
		}
        const {addLayers} = useChipLayers.getState(); 
		let reader = new FileReader();

		reader.onload = function (evt:any) {
			if(evt.target.readyState !== 2){
				return;	
			}
			if(evt.target.error) {
				alert("Error while reading file");
				return;
			}
            const {projectName, layers} = JSON.parse(evt.target.result) as IProjectStructure;
            setProjectName(projectName)
            addLayers(layers);
        };
		reader.readAsText((target as unknown as {files:Blob[]}).files[0]);
    }

    useEffect(() => {
        if(resolution.height > 0){
            const {updateLayer} = useChipLayer.getState();
            const {addLayer, setActiveLayerId, getNewLayer} = useChipLayers.getState();
            const newLayer =  getNewLayer();
            newLayer.resolution = {...resolution};
            updateLayer({...newLayer});
            addLayer({...newLayer});
            setActiveLayerId(newLayer.id);
        }
    },[resolution]);

    return (
        <TabContainer title="Project" tabTitle="Configurations">
            <ProjectPropertiesWrap>
                <PropertyInputs>
                    <Row>
                        Project name:
                        <input type="text" value={projectName} maxLength={40} onChange={updateProjectName} />
                    </Row>
                    <Row>
                        <ConfirmButton>
                            import project
                            <input 
                                style={{
                                    position: "absolute",
                                    left:0,
                                    right:0,
                                    top:0,
                                    bottom:0,
                                    opacity:0,
                                }}
                                alt=""
                                onChange={uploadFileHandler}
                                type="file"
                            />
                        </ConfirmButton>
                    </Row>
                    <Row>
                        <ConfirmButton onClick={downloadProject}>
                            download project
                        </ConfirmButton>
                    </Row>
                </PropertyInputs>
            </ProjectPropertiesWrap>
        </TabContainer>
    );
}

export default ProjectProperties;