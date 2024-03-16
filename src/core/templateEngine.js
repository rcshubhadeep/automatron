const Handlebar = require("handlebars");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

export function applyTemplate(mainString, vars) {
    if (mainString === "") {
        return "";
    }
    if (isEmpty(vars)) {
        return mainString;
    }
    var source = Handlebar.compile(mainString)
    return source(vars);
}