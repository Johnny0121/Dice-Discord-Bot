
const evaluateExpressionArray = expressionArray => {
    for (var i = 0; i < expressionArray.length; i++) {
        if (isDiceExpression(expressionArray[i])) {
            expressionArray[i] = evaluateDiceExpression(expressionArray[i]);
        }
    }

    return expressionArray;
}
const evaluateDiceExpression = exp => {
    var arr = exp.split('d');

    if (arr.length != 2) {
        console.log('Could not evaluate');
        return exp;
    }

    var sum = 0;
    var numbers = [];

    for (var i = 0; i < arr[0]; i++) {
        var generatedNumber = Math.floor(Math.random() * arr[1]) + 1;

        sum += generatedNumber;
        numbers.push(generatedNumber);
    }

    return {
        sum: sum,
        text: `(${numbers.join('+')})`
    }
}

const isDiceExpression = arg => ((arg.match(/d/g) || []).length == 1) && arg.split('d').length == 2;
const isMathOperator = value => value.match('[+-\/*]+');
const toExpressionArray = expression => {
    var result = [];
    var value = '';

    for (let char of expression) {
        if (!isMathOperator(char)) {
            value += char;
        } else {
            result.push(value);
            result.push(char);
            value = '';
        }
    }

    result.push(value);

    return result;
}

module.exports = {
    name: 'roll',
    description: 'This is a roll command.',
    execute(message, args) {
        var expression = args.join('');
        var evaluatedExpressionArray = evaluateExpressionArray(toExpressionArray(expression));

        var text = '';

        for (let elem of evaluatedExpressionArray) {
            if (elem.text) {
                text += elem.text;
            } else {
                text += elem;
            }
        }

        for (var i = 0; i < evaluatedExpressionArray.length; i++) {
            if (evaluatedExpressionArray[i].sum) {
                evaluatedExpressionArray[i] = evaluatedExpressionArray[i].sum;
            }
        }

        var result = eval(evaluatedExpressionArray.join(''));


        message.channel.send(`${message.member.user}: \`${text}\` = ${result}`);
    }
};