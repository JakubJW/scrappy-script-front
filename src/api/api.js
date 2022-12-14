import axios from "axios";

export const postUrl = async (url, docs) => {
    const response  = await axios.post('/generateFiles', {
        params: {
            url: url,
            selectedDocuments: docs
        }
    })

    return response
}

export const getFiles = async () => {
    const response  = await axios.get('/download', {
        responseType: 'blob',
        headers: {
            'Content-Type': 'application.zip'
        }
    })

    return response
}