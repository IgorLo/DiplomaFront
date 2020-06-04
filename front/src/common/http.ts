import {Config} from "./config";

export module http {

    import host = Config.host;

    export function getRequest(url: string, withCredentials : boolean): Promise<any> {
        return new Promise<any>(
            function (resolve, reject) {
                const request = new XMLHttpRequest();
                request.onload = function () {
                    if (this.status === 200) {
                        resolve(this.response);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };
                request.onerror = function () {
                    reject(new Error('XMLHttpRequest Error: ' + this.statusText));
                };
                request.open('GET', host + url);
                if (withCredentials){
                    request.withCredentials = true;
                }
                request.send();
            }
        );
    }

    export function postRequest(url: string, parameters: FormData, withCredentials : boolean): Promise<any> {
        return new Promise<any>(
            function (resolve, reject) {
                const request = new XMLHttpRequest();
                request.onload = function () {
                    if (this.status === 200) {
                        resolve(this.response);
                    } else {
                        reject(new Error(this.statusText));
                    }
                };
                request.onerror = function () {
                    reject(new Error('XMLHttpRequest Error: ' + this.statusText));
                };
                request.open('POST', host.concat(url));
                if (withCredentials){
                    request.withCredentials = true;
                }
                request.send(parameters);
            }
        );
    }

    export function contentOfPostRequest(url: string, parameters: any, withCredentials : boolean, handler: Function) {
        postRequest(url, parameters, withCredentials)
            .then(response => {
                handler(response);
            });
    }

    export function contentOfGetRequest(url: string, withCredentials : boolean, handler: Function) : void {
        getRequest(url, withCredentials)
            .then(response => {
                let responseContent = JSON.parse(response);
                handler(responseContent);
            })
            .catch(error => {
                console.log(error);
            });
    }

    export function getEntity(url: string, handler: Function) : void {
        contentOfGetRequest(url, true, handler);
    }

}
