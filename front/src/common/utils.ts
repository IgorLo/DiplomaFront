export module utils {

    export function compareByAlph(a : string, b : string) : number {
        if (typeof a == 'undefined' && typeof b == "undefined"){
            return 0;
        }
        if (typeof a == 'undefined'){
            return 1;
        }
        if (typeof b == 'undefined'){
            return -1;
        }
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    }
}