module.exports = function getDistanceBetween(latSource, longSource, latDest, longDest) {
    var R = 6371;
    var difLat = latDest - latSource;
    var difLon = longDest - longSource;
    var dLat = convertToRadians(difLat);
    var dLon = convertToRadians(difLon);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(convertToRadians(latSource)) * Math.cos(convertToRadians(latDest)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function convertToRadians(degree) {
    return degree * (Math.PI / 180);
}