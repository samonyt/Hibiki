module.exports = {
    duration: (ms) => {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor(ms / (1000 * 60 * 60)).toString();
        return `${hrs.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
    },
    list: (arr, conj = 'and') => {
        const len = arr.length;
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    },
    trimArray: (arr, maxLen = 10) => {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    },
    shorten: (text, maxLen = 2000) => {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }
};