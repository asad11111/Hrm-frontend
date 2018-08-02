export class BaseStore {

    _callbacks = {
        '__change': []
    };
    getState(){
    }
    emit(action, ...args){
        var callbacks = this._callbacks[action] || [];
        callbacks.forEach((cb)=>{
            cb(...args);
        })
    }
    on(action, cb){
        if(!this._callbacks[action]){
            this._callbacks[action] = [];
        }
        this._callbacks[action].push(cb);
    }
    off(action, cb){
        if(!this._callbacks[action]) return false;
        var index = this._callbacks[action].indexOf(cb);
        if(index == -1) return false;
        this._callbacks[action].splice(index, 1);
    }
    emitChange(){
        this.emit('__change', this.getState());
    }
    onChange(cb){
        this._callbacks.__change.push(cb);
        cb(this.getState());
    }
    offChange(cb){
        this.on('__change', cb);
    }
}
