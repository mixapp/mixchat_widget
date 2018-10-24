import axios from 'axios';
const getUrl = (companyId, path) => {
    return `https://api.mixapp.io/webhooks/mixapp/5bc49dd0574e7403e22ec1a0/${companyId}/${path}`
}

export const config = {
    companyId: ''
};



// Fetch widget settings by company
export const fetchSettings = async () => {
    try {
        const uri = getUrl(config.companyId, 'widget');
        const result = await axios.get(uri);
        return result.data.result;
    } catch (err) {
        throw err;
    }
};

// Async Delay for testing
export const timeout = async (delay) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    });
}