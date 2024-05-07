/** recognize function 
 * 
 * @param {*} trace 
 * @param {*} options 
 * @param {*} callback 
 */

export function recognise (trace, options, callback) {
    var data = JSON.stringify({
        options: "enable_pre_space",
        requests: [
            {
            writing_guide: {
                writing_area_width: options.width || this.width || undefined,
                writing_area_height: options.height || this.width || undefined,
            },
            ink: trace,
            language: options.language || "zh_TW",
            },
        ],
    });
  
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            switch (this.status) {
            case 200:
                var response = JSON.parse(this.responseText);
                var results;
                if (response.length === 1) {
                callback(undefined, new Error(response[0]));
                break;
                } else results = response[1][0][1];
                if (options.numOfWords) {
                results = results.filter(function (result) {
                    return result.length == options.numOfWords;
                });
                }
                if (options.numOfReturn) {
                results = results.slice(0, options.numOfReturn);
                }
                callback(results, undefined);
                break;
            case 403:
                callback(undefined, new Error("access denied"));
                break;
            case 503:
                callback(undefined, new Error("can't connect to recognition server"));
                break;
            }
        }
    });
    xhr.open(
        "POST",
        "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8"
    );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(data);
}