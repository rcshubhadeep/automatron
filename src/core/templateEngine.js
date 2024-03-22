// const Handlebar = require("handlebars");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

/***
 * HandleBar or any such template engine, which uses eval or new Function
 * does not work in extension for safety reason.
 * Here I am starting to make a different kind of template engine which
 * won't need that.
 */

// export function applyTemplate(mainString, vars) {
//     if (mainString === "") {
//         return "";
//     }
//     if (isEmpty(vars)) {
//         return mainString;
//     }
//     var source = Handlebar.compile(mainString)
//     return source(vars);
// }

export function applyTemplate(mainString, vars) {
    if (mainString === "") {
        return "";
    }
    if (isEmpty(vars)) {
        return mainString;
    }
    return mainString.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return Object.hasOwnProperty.call(vars, key) ? vars[key] : match;
    });
}