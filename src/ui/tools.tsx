import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import updloadBgImg from "./assets/picture.png";
import downloadImg from "./assets/save.png";
import updloadImg from "./assets/upload_cloud.png";

const Tools = styled.div`
    display:flex;
    // padding-bottom: .4rem;
    flex-direction: row;
    justify-content: end;
    align-items: center;
`;

interface IconToolProps {
    bgImage: string,
    description: string,
    active?: boolean,
}

const BasicToolStyle = styled.div`
    height: 28px;
    width: 28px;
    // border: 2px solid #020202;
    background-position: center center;
    background-repeat: no-repeat;
    // border-radius: 4px;
    border-radius: 2px;
    margin: .2rem;
    position: relative;
    display: block;
    // &:hover{
    //     background-color: #777;
    // }
    cursor: pointer;
`;

const ToolBtn = styled(BasicToolStyle).attrs((props: IconToolProps) => ({
    alt: props.description,
    title: props.description,
    style: {
        backgroundColor: props.active ? '#a6a3a3' : 'transparent',
        backgroundImage: `url(${props.bgImage})`,
    },
})) <IconToolProps>`

`;



const ToolLink: React.FC<IconToolProps & { to: string }> = (props) => {
    return (
        <BasicToolStyle
            as={Link}
            to={props.to}
            style={{
                backgroundColor: props.active ? '#a6a3a3' : 'transparent',
                backgroundImage: `url(${props.bgImage})`,
            }}
            title={props.description}
        />
    )
}

const InputHidden = styled.input`
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    cursor: pointer;
`;

const ToolBadge = styled.div`
    position: absolute;
    border: 1px solid #000;
    right: -2px;
    top: -2px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    font-size: 7pt;
    text-align: center;
    line-height: 11px;
    background-color: #d9d3d3;
`;


const UploadBtn: React.FC<{
    onUpload: (result: any) => void,
    description: string,
    accept: string,
}> = ({
    onUpload,
    description,
    accept,
}) => {
        const uploadFileHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
            if (!window["FileReader"]) {
                return;
            }
            let reader = new FileReader();

            reader.onload = function (evt: any) {
                if (evt.target.readyState !== 2) {
                    return;
                }
                if (evt.target.error) {
                    alert("Error while reading file");
                    return;
                }
                const uploadResultText = JSON.parse(evt.target.result) as any;
                onUpload(uploadResultText);
            };
            reader.readAsText((target as unknown as { files: Blob[] }).files[0]);
        }

        return (
            <ToolBtn
                bgImage={updloadImg}
                description={description}
            >
                <InputHidden
                    alt=""
                    onChange={uploadFileHandler}
                    type="file"
                    accept={accept}
                // accept="program/json"
                />
            </ToolBtn>
        )
    }

const UploadImgBtn: React.FC<{
    onUpload: (imgUrlData: string) => void,
    bgImage?: string,
}> = ({
    onUpload,
    bgImage,
}) => {
        const uploadFileHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
            if (!window["FileReader"]) {
                return;
            }

            const files = (target as unknown as { files: Blob[] }).files;
            const size = files[0].size;

            if (size > 1048576) { //1MB         
                alert('Not Allow');
                return;
            }

            let reader = new FileReader();

            reader.onload = function (evt: any) {
                if (evt.target.readyState !== 2) {
                    return;
                }
                if (evt.target.error) {
                    alert("Error while reading file");
                    return;
                }
                onUpload(evt.target.result);
            };

            reader.readAsDataURL(files[0]);
        }

        return (
            <ToolBtn
                bgImage={bgImage || updloadBgImg}
                description="Open background image"
            >
                <InputHidden
                    alt="Open background image"
                    onChange={uploadFileHandler}
                    type="file"
                    // onClick={() => console.log('opa')}
                    accept="image/jpeg, image/png, image/jpg"
                />
            </ToolBtn>
        )
    }

const DownloadConfigFileBtn: React.FC<{
    description: string,
    fileExtension: string,
    onDownload: () => Promise<{
        fileContent: string,
        fileName: string,
    }>,
}> = ({ description, fileExtension, onDownload }) => {

    const downloadConfigFile = async () => {
        const { fileContent, fileName } = await onDownload();
        const element = document.createElement("a");
        const file = new Blob([fileContent], { type: 'text/json' });
        element.href = URL.createObjectURL(file);
        element.download = `${fileName}.${fileExtension}`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <ToolBtn
            bgImage={downloadImg}
            onClick={downloadConfigFile}
            description={description}
        />
    )
}

export { DownloadConfigFileBtn, InputHidden, ToolBadge, ToolBtn, ToolLink, Tools, UploadBtn, UploadImgBtn };

