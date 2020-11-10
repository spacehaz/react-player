export default (str) => {
    var sessionStoreKey = "myStringColors" + str;
    if (!sessionStorage[sessionStoreKey ]) {
        sessionStorage[sessionStoreKey] = Math.random()*0xFFFFFF<<0;       
    }
    var randomColor = sessionStorage[sessionStoreKey];

    return '#'+ randomColor;
}