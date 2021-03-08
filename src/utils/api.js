import { config } from './config'
import Toast from 'react-native-simple-toast';
import { request } from 'react-native-permissions';

const post = async (props) => {

    const {
        url,
        body
    } = props;

    const apiUrl = `${config.API_URL}/${url}`
    const result = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            if( response.status === 200 || response.status === 201 ) {
                 return response.json()
            }
        })
        .then((res) => {
            return res;
        })
        .catch(error => {
            console.log( 'error is ',error )
            Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER);
            return null;
        })
    return result;
}

function createFormData( media ) {
    const data = new FormData()
    if ( media ) {
        const localUri = media.uri
        const filename = localUri.split( "/" ).pop()
        data.append( "file", {
            name: filename,
            uri: localUri,
            type: media.mime || "image/jpeg",
        } )
    }

    return data
}

const imageUpload = async (props) => {
    const { url, image } = props
    const formdata = createFormData( image )
    
    var requestOptions = {
        method: 'POST',
        body: formdata,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        redirect: 'follow'
      };
    const apiUrl = `${config.API_URL}/${url}`
    const result = await fetch(apiUrl, requestOptions)
        .then((response) => {
            return response.json()
        })
        .then((res) => {
            return res;
        })
        .catch(error => {
            Toast.showWithGravity('Something Went Wrong', Toast.LONG, Toast.CENTER);
            return null;
        })
    return result;
}

const get = async (props) => {
    const {
        url
    } = props
    const apiUrl = `${config.API_URL}/${url}`
    const result = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((response) => {
            return response;
        })
        .catch(error => {
            Toast.showWithGravity('Something Went Wrong', Toast.LONG, Toast.CENTER);
            return null;
        })
    return result;
}

export const api = {
    get,
    post,
    imageUpload
}