import * as _update from 'immutability-helper';

export function clone(o:any){
    if(o){
        return JSON.parse(JSON.stringify(o));
    }
    return o;
}

export function interpolate(str, o){
    return str.replace(
        /{([^{}]*)}/g,
        function (a, b) {
            let r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
}

export function uriToBlob(dataURI) {
    let byteString, mimeString;
    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let content = [];
    for (let i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }
    return new Blob([new Uint8Array(content)], {type: mimeString});
}

export function toFormData(obj, form?, namespace?) {
    let fd = form || new FormData();
    let formKey;
    for(let property in obj) {
        if(obj.hasOwnProperty(property)) {
            if(namespace) {
                formKey = namespace + '[' + property + ']';
            } else {
                formKey = property;
            }
            if(typeof obj[property] === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof  Blob)) {
                toFormData(obj[property], fd, property);
            } else {
                fd.append(formKey, obj[property]);
            }
        }
    }
    return fd;
}

export function update<T>(o:T, spec:any):T{
    return _update(o, spec);
}
