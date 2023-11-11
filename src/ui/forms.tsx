import styled from "styled-components";

const FormRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: .5rem;
    flex-direction: column;
    > label {
        font-size: .8rem;
        margin-bottom: .2rem;
    }
    > input, select {
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: transparent;
        height: 1.9rem;
    }
    > input[type=checkbox] {
        border: 1px solid red;
        height: .9rem;
    }
`;

const FormCol = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const BtnGroupt = styled.div`
    display: flex;
    padding: .5rem;
    > * {
        margin-right: .2rem;
        margin-left: .2rem;
    }

    *:nth-last-child(1){
        margin-right: 0;
    }    
    *:nth-child(1){
        margin-left: 0;
    }
`;

const BtnAction = styled.div<{ $disabled?: boolean }>`
    display: flex;
    border: 1px solid #605656;
    flex-direction: row;
    align-items: center;
    padding: 0.4rem .6rem .3rem .6rem;
    background-color: #7a9eb3;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    position: relative;
    opacity: ${({ $disabled }) => $disabled ? .5 : 1};
`;

const BtnActionDanger = styled(BtnAction)`
    background-color: #e15353;
`;

const H2 = styled.h2`
    padding: 0 .5rem;
    margin: 0;
`;

export { BtnAction, BtnActionDanger, BtnGroupt, FormCol, FormRow, H2 };

