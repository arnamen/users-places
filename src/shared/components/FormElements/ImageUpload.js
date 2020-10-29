import React, { useRef, useState, useEffect } from 'react';

import './ImageUpload.css';
import Button from './Button'
const ImageUpload = ( props ) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false)

    const filePickerRef = useRef();

    useEffect(() => {
        if(!file) return;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        
        fileReader.readAsDataURL(file)
    }, [file])

    const pickedHandler = (event) => {
        let uploadedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1){
            uploadedFile = event.target.files[0];
            setFile(uploadedFile);
            fileIsValid = true;
            setIsValid(true);
        }
        else {
            fileIsValid = false;
            setIsValid(false);
        }
        props.onInput(props.id, uploadedFile, fileIsValid);
    }
    

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }
    

    return (
        <div className='form-control'>
            <input 
            ref={filePickerRef}
            type='file' 
            id={props.id} 
            style={{display: "none"}} 
            accept=".jpg,.png,.jpeg"
            onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}></div>
            <div className="image-upload__preview">
                {previewUrl && <img src={previewUrl} alt="preview"></img>}
                {!previewUrl && <p>Please pick an image</p>}
            </div>
            <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload;
