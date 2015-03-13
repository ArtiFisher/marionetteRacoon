Racoon.dateFilter = function(input){
    var options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    },
        date = new Date(input),
        now = date.toLocaleTimeString('en-us', options).split(', ');
    if (!now[2]) {
        return 'no date';
    }
    return '' + now[2] + ' ' + now[0] + ', ' + now[1];
};