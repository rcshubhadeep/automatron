// import _ from 'lodash';

// export const getHBValues = (text) => {
//     const re = /{{[{]?(.*?)[}]?}}/g;
//     const tags = [];
//     let matches;
//     while (Boolean((matches = re.exec(text)))) {
//         if (matches) {
//             tags.push(matches[1]);
//         }
//     }
//     const root = {};
//     let context = root;
//     const stack = [];
//     const setVar = (variable, val) => {

//         // Dot Notation Breakdown
//         if (variable.match(/\.*\./) && !variable.match(/\s/)) {
//             let notation = variable.split('.')
//             _.set(context, notation, "")
//         }
//         else {
//             context[variable.trim()] = val;
//         }
//     };
//     for (let tag of tags) {
//         if (tag.startsWith('! ')) {
//             continue;
//         }
//         if (tag == 'else') {
//             continue;
//         }
//         if ('#^'.includes(tag[0]) && !tag.includes(' ')) {
//             setVar(tag.substr(1), true);
//             stack.push(context);
//             continue;
//         }
//         if (tag.startsWith('#if')) {
//             const vars = tag.split(' ').slice(1);
//             for (const v of vars) {
//                 setVar(v, true);
//             }
//             stack.push(context);
//             continue;
//         }
//         if (tag.startsWith('/if')) {
//             context = stack.pop();
//             continue;
//         }
//         if (tag.startsWith('#with ')) {
//             const v = tag.split(' ')[1];
//             let newContext = {};
//             context[v] = newContext;
//             stack.push(context);
//             context = newContext;
//             continue;
//         }
//         if (tag.startsWith('/with')) {
//             context = stack.pop();
//             continue;
//         }
//         if (tag.startsWith('#unless ')) {
//             const v = tag.split(' ')[1];
//             setVar(v, true);
//             stack.push(context);
//             continue;
//         }
//         if (tag.startsWith('/unless')) {
//             context = stack.pop();
//             continue;
//         }
//         if (tag.startsWith('#each ')) {
//             const v = tag.split(' ')[1];
//             const newContext = {};
//             context[v] = [newContext];
//             stack.push(context);
//             context = newContext;
//             continue;
//         }
//         if (tag.startsWith('/each')) {
//             context = stack.pop();
//             continue;
//         }
//         if (tag.startsWith('/')) {
//             context = stack.pop();
//             continue;
//         }
//         setVar(tag, '');
//     }

//     return root;
// };


// console.log(getHBValues("My name is {{ name }}"));

export function parseHandleBar(templateString){
    // Regular expression to find all instances of text enclosed in double curly braces
    const templateVariableRegex = /{{\s*([^}]+)\s*}}/g;
    let match;
    const variables = {};

    // Use the regular expression to find all template variables in the task description
    while ((match = templateVariableRegex.exec(templateString)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === templateVariableRegex.lastIndex) {
            templateVariableRegex.lastIndex++;
        }

        // The matched template variable, excluding the curly braces, is in match[1]
        variables[match[1].trim()] = ""; // Trim any extra whitespace from the variable name
    }

    // console.log("Detected template variables:", variables);
    return variables
}

// console.log(parseHandleBar("My name is Shubhadeep and my age is 45"))
