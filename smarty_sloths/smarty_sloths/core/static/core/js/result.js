function stringToList(string) {
    string = string.replace(/,\s*$/, "");
    return string.split(',');
}

function getSum(list) {
    var sum = 0;
    for (i in list) {
        sum += parseFloat(list[i]);
    }
    return sum;
}

function getMinIndex(list) {
    var minIndex = 0;
    for (i in list) {
        if (parseFloat(list[i]) < parseFloat(list[minIndex])) {
            minIndex = i;
        }
    }
    return minIndex;
}

function getMaxIndex(list) {
    var maxIndex = 0;
    for (i in list) {
        if (parseFloat(list[i]) > parseFloat(list[maxIndex])) {
            maxIndex = i;
        }
    }
    return maxIndex;
}

function calculateAvg(list) {
    var sum = getSum(list);
    return sum / list.length;
}

function calculateSD(avg, list) {
    var squaredDiffs = [];
    for (i in list) {
        var diff = parseFloat(list[i]) - avg;
        squaredDiffs.push(diff * diff);
    }

    var avgSquaredDiffs = calculateAvg(squaredDiffs);

    return Math.sqrt(avgSquaredDiffs);
}

$(document).ready(function() {
    // Remote processing times
    remoteTimes = stringToList(remoteTimes);

    $('#remote-time').text(getSum(remoteTimes));

    var remoteAvgTime = calculateAvg(remoteTimes);
    $('#remote-avg-time').text(remoteAvgTime.toFixed(2));
    $('#remote-sd-time').text(calculateSD(remoteAvgTime, remoteTimes).toFixed(2));

    var remoteMinTimeIndex = getMinIndex(remoteTimes);
    var remoteMaxTimeIndex = getMaxIndex(remoteTimes);
    $('#remote-min-time').text(remoteTimes[remoteMinTimeIndex]);
    $('#remote-min-time-index').text(remoteMinTimeIndex);
    $('#remote-max-time').text(remoteTimes[remoteMaxTimeIndex]);
    $('#remote-max-time-index').text(remoteMaxTimeIndex);

    // Remote exchanged data
    data = stringToList(data);

    $('#exchanged-data').text(getSum(data));

    var avgData = calculateAvg(data);
    $('#avg-exchanged-data').text(avgData.toFixed(2));
    $('#sd-exchanged-data').text(calculateSD(avgData, data).toFixed(2));

    var minDataIndex = getMinIndex(data);
    var maxDataIndex = getMaxIndex(data);
    $('#min-exchanged-data').text(data[minDataIndex]);
    $('#min-exchanged-data-index').text(minDataIndex);
    $('#max-exchanged-data').text(data[maxDataIndex]);
    $('#max-exchanged-data-index').text(maxDataIndex);

    // Local processing times
    localTimes = stringToList(localTimes);

    $('#local-time').text(getSum(localTimes));

    var localAvgTime = calculateAvg(localTimes);
    $('#local-avg-time').text(localAvgTime.toFixed(2));
    $('#local-sd-time').text(calculateSD(localAvgTime, localTimes).toFixed(2));

    var localMinTimeIndex = getMinIndex(localTimes);
    var localMaxTimeIndex = getMaxIndex(localTimes);
    $('#local-min-time').text(localTimes[localMinTimeIndex]);
    $('#local-min-time-index').text(localMinTimeIndex);
    $('#local-max-time').text(localTimes[localMaxTimeIndex]);
    $('#local-max-time-index').text(localMaxTimeIndex);
});
