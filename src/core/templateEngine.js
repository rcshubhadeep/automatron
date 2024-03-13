export const TemplateEngine = function(html, options) {
    let re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|})).*/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;
    const add = function(line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index));
        add(match[1], true); // Here we add the JavaScript code/variable directly
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';

    // Using new Function can be risky if the content includes user-supplied data
    // Consider alternative templating solutions for more complex scenarios
    return new Function('options', code.replace(/[\r\t\n]/g, '')).apply(options, [options]);
}
