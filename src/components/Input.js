import React, { useState } from "react";
import axios from 'axios'
import { postUrl, getFiles } from "../api/api";

function SelectDocument(props) {
    const [isToggled, toggle] = useState(false)
    
    const handleToggle = () => {
        isToggled ? toggle(false) : toggle(true)
        props.isSelected(props.value)
    }

    const handleDocName = (event) => {
        props.docName({docType: props.value, docName: event.target.value})
    }   

    return(
        <div className="box-content flex bg-base-200 items-center start h-16 gap-8 p-4">
            <h2 className="text-xl text-left w-36 ml-6">{props.name }</h2>
            <input 
                type="checkbox"
                value={ props.value } 
                className="toggle toggle-primary"
                onChange={ handleToggle }
                />    
            <input 
                type="text" 
                placeholder="Nazwa dokumentu" 
                className="input input-primary rounded-none focus:border-none focus:outline-offset-0"
                disabled = { !isToggled }
                onChange = { handleDocName }
                />
        </div>
    )
}

function Input() {
    const [link, setLink] = useState(String)
    const [fetchDisabled, toggleFetch] = useState(true)
    const [docs, setDocs] = useState([])

    const handleSubmit = () => {
        postUrl(link, docs)
        .then((res) => {
            if(res.status === 200) {
                getFiles().then((res) => {
                    const fileURL = window.URL.createObjectURL(new Blob([res.data]))
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL;
                    const fileName = 'mydocuments.zip'
                    fileLink.setAttribute('download', fileName);
                    fileLink.setAttribute('target', '_blank');
                    document.body.appendChild(fileLink);
                    fileLink.click()
                    fileLink.remove()
                })
            }
        }).catch((error) => console.log(error))
    }

    const handleLinkInput = event => {
        setLink(event.target.value)
        if(event.target.value.length && docs.length) {toggleFetch(false)} else toggleFetch(true)
    }

    const handleToggleInput = (data) => {
        if(!docs.length) {
            setDocs(...docs, [{docType: data, docName: ''}])
            if(link.length) { toggleFetch(false) }
        } else if(docs.filter(elem => elem.docType === data).length) {
            setDocs(prevState => prevState.filter(elem => elem.docType !== data))
            if(docs.length - 1 === 0) { toggleFetch(true) }
        } else {
            setDocs(prevState => [...prevState, {docType: data, docName: ''}])
        }
    }

    const setDocName = (data) => {
        const newNames = docs.map(doc => {
            if(doc.docType !== data.docType) {
                return doc
            }
            else {
                return {...doc, docName: data.docName + '.docx'}
            }
        })
        setDocs(newNames)
    }

    const startDownloading = event => {
        event.preventDefault()
        axios.get('/download', {
            responseType: 'blob', 
            headers: {
                'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }}).then((res) => {
                const fileURL = window.URL.createObjectURL(new Blob([res.data]))
                const fileLink = document.createElement('a');
                fileLink.href = fileURL;
                const fileName = 'tytulowa.docx'
                fileLink.setAttribute('download', fileName);
                fileLink.setAttribute('target', '_blank');
                document.body.appendChild(fileLink);
                fileLink.click()
                fileLink.remove()
            })
    }

    return (
        <div className="flex flex-col gap-4">
            <form 
                className="form-control flex items-center gap-4" 
                onSubmit={ handleSubmit }>
                <input 
                    type="text" 
                    name="linkInput" 
                    placeholder="Link do zgłoszenia" 
                    className="input 
                        rounded-none 
                        input-primary 
                        w-full" 
                    onChange={ handleLinkInput }
                    />
            </form>
            <form className="form-control flex gap-4 justify-center">
                <h1 className="text-3xl font-bold">Zaznacz dokumenty, które chcesz wygenerować: </h1>
                <div>
                    <SelectDocument 
                        isSelected = { handleToggleInput } 
                        docName = { setDocName }
                        value = { "titleDoc" } 
                        name={ "Strona tytułowa" } 
                        />
                    <SelectDocument 
                        isSelected = { handleToggleInput } 
                        docName = { setDocName }
                        value = { "reportDoc" } 
                        name={ "Sprawozdanie" } 
                        />
                    <SelectDocument 
                        isSelected = { handleToggleInput } 
                        docName = { setDocName }
                        value = { "inventoryDoc" } 
                        name={ "Inwentaryzacja" } 
                        />
                    <SelectDocument 
                        isSelected = { handleToggleInput } 
                        docName = { setDocName }
                        value = { "censusDoc" } 
                        name={ "Arkusz spisowy" } 
                        />
                </div>
            </form>
            <button className="btn btn-primary rounded-none" onClick={ handleSubmit } disabled = { fetchDisabled } >Pobierz</button>
        </div>
    )
} export default Input