import * as bridge from "./bridge"

function get (key, callback) {
    bridge.trigger("read", {
        key
    }, callback);
}

function set (key, value, callback) {
    bridge.trigger("write", {
        key,
        value
    }, callback);
}

export default {
    get,
    set
}