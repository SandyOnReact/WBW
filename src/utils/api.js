import { config } from './config'
import Toast from 'react-native-simple-toast';

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
        body: JSON.stringify( body )
    })
    .then( ( response )  => response.json() )
    .then( ( res ) => {
        return res;
    } )
    .catch( error => {
        Toast.showWithGravity('Something Went Wrong', Toast.LONG, Toast.CENTER);
        return null;
    })
    return result;
}

const get = ( props ) => {
    const {
        url
    } = props
    const apiUrl = `${config.API_URL}/${url}`
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then( res => res.json() )
    .then( ( response ) => {
        return response;
    } )
    .catch( error => {
        Toast.showWithGravity('Something Went Wrong', Toast.LONG, Toast.CENTER);
        return null;
    })
}

export const api = {
    get,
    post
}