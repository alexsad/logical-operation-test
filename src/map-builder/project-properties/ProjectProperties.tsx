import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TabContainer from '../TabContainer';
// import { IChipLayer } from '../../interfaces/interfaces';
import useChipLayers from '../stores/useChipLayers';
import useChipLayer from '../stores/useChipLayer';
import { IChipLayer } from '../../interfaces/interfaces';

const ProjectPropertiesWrap = styled.div`
    > .properties-input > label{
        width: 99%;
        text-align: left;
        font-size: 12px;
        float: left;
        padding: 4px;
        color: rgb(78, 78, 78);

        > .row {
            width: 100%;
            margin-top: 5px;

            > input {
                float: left;
                &[type=text]{
                    width: 15%;
                }
                &[type=checkbox]{
                    display: block;
                    width: 95%;
                }
                &[type=range]{
                    width: 75%;
                    margin-top: 0px;
                    margin-left: 2%;
                }
            }
        }
    }
`;

interface IProjectStructure {
    projectName: string,
    layers: IChipLayer[],
}

const ProjectProperties: React.FC =  () => {
    const [projectName, setProjectName] = useState('my-project');

    const updateProjectName = ({target}:React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(target.value);
    }

    const downloadProject = () => {
        const layers = useChipLayers.getState().layers;
        const projectStructure: IProjectStructure = {
            layers,
            projectName: projectName,
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

            useChipLayers.getState().setActiveLayerId('');
            useChipLayers.getState().setLayers(layers);
            if(!!layers.length){
                const lastLayer = layers[layers.length-1];
                useChipLayers.getState().setActiveLayerId(lastLayer.id);
                useChipLayer.getState().updateLayer(lastLayer);
            }
        };
		reader.readAsText((target as unknown as {files:Blob[]}).files[0]);
    }

    useEffect(() => {
        const {updateLayer} = useChipLayer.getState();
        const {addLayer, setActiveLayerId, getNewLayer} = useChipLayers.getState();
        const newLayer =  getNewLayer();
        updateLayer({...newLayer});
        addLayer({...newLayer});
        setActiveLayerId(newLayer.id);
    },[]);

    return (
        <TabContainer title="Project" tabTitle="Configurations">
            <ProjectPropertiesWrap>
                <div className="properties-input">
                    <label>
                        Project name:
                        <div className="row">
                        <input style={{width:'90%'}} type="text" value={projectName} maxLength={40} onChange={updateProjectName} />
                        </div>
                    </label>
                    <label>
                        <input alt="" onChange={uploadFileHandler} type="file"/>
                    </label>                    
                    <label>
                        <button onClick={downloadProject}>
                            download project
                        </button>
                    </label>
                </div>
            </ProjectPropertiesWrap>
        </TabContainer>
    );
}

export default ProjectProperties;