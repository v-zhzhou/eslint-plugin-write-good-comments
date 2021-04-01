const writeGood = require('write-good');

function validateComment(context, node) {
    const commentText = node.value.trim()
    const suggestions = writeGood(commentText);


    suggestions.forEach(suggestion => {
        const message = suggestion.reason.replace('\n', ' ')
        const loc = {
            start: {
                line: node.loc.start.line,
                column: node.loc.start.column + suggestion.index + 3
            },
            end: {
                line: node.loc.start.line,
                column: (
                    node.loc.start.column +
                    suggestion.index + 3 +
                    suggestion.offset)
            },
        }

        context.report({
            loc, message
        })
    })
}

module.exports = {
    create: function(context) {
        return {
            Program() {
                const sourceCode = context.getSourceCode();
                sourceCode.getAllComments()
                    .filter(token => token.type !== "Shebang")
                    .forEach(node => validateComment(context, node));
            }
        };
    }
};
