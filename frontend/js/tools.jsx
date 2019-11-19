/**
* Formatting the date with format yyyymmdd, return
* a String that in format yyyy-mm-dd
* @param {String} date Date in format yyyymmdd
*/
export function formattingDate(date) {
    if(!date) {
        return;
    }
    return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
}