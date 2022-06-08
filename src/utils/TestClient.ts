import axios from 'axios';


export class TestClient {
    url: string;
    jar: any;
    options: {
        method: string,
        url: string;
        withCredentials: boolean;
        // jar: any
    }

    constructor(url: string) {
        this.url = url;
        this.options = {
            method: 'post',
            url: this.url,
            withCredentials: true
        }
    }

    async login(email: string, password: string) {
        return axios({
            ...this.options,
            data: { query: { email, password } } // temporary
        });
    }

    async person() {
        return axios({
            ...this.options,
            data: { query: 'placeholder' } // temporary
        });
    }

    async logout() {
        return axios({
            ...this.options,
            data: { query: 'placeholder' } // temporary
        });
    }
}