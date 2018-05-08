/*eslint-env node, es6*/

/* Module Description */
// Finds regex answers within quiz questions

/* Put dependencies here */
const he = require('he');

module.exports = (course, stepCallback) => {

    // Filter down to only quizzes
    var quizzes = course.content.filter(file => file.name.includes('quiz') && file.ext === '.xml');

    // Filter down to only quizzes with regex questions
    quizzes = quizzes.filter(file => file.dom('d2l_2p0\\:answer_is_regexp').length > 0);

    // Get the Regex Questions and their instances, then save to the array
    quizzes.forEach(quiz => {
        var $ = quiz.dom;

        // Get all regex questions
        var regexQuestions = quiz.dom('item').map((index, elem) => {
            return {
                number: index + 1,
                dom: $(elem)
            };
        }).filter((index, elem) => {
            return elem.dom.find('d2l_2p0\\:answer_is_regexp').length > 0;
        });

        // Get regex instances in questions, then save the question to the array
        regexQuestions.each((index, question) => {
            var mattexts, html;

            mattexts = question.dom.find('mattext').map((i, mattext) => {
                return $(mattext).text();
            }).get().join(' ____ ');

            html = he.decode(mattexts);
            if (html.length > 70) {
                html = html.substr(0, 70) + '...';
            }

            var regexs = question.dom.find('d2l_2p0\\:answer_is_regexp').map(function (i, el) {
                return $(el).parent().prev().text();
            }).get().join(', ');

            course.log('Quiz Questions with Regex', {
                'Quiz': $('assessment').attr('title'),
                'Question Number': question.number,
                'Question Title': $(question).attr('title') || '(blank)',
                'Question': $.load(html).text().replace(/\s+/g, ' '),
                'Regexs': regexs
            });
        });
    });

    stepCallback(null, course);
};