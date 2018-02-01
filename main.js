/*eslint-env node, es6*/

/* Module Description */
// Finds regex answers within quiz questions

/* Put dependencies here */
const d3 = require('d3-dsv');
const fs = require('fs');
const he = require('he');

module.exports = (course, stepCallback) => {
    var questionList;

    function getRegex(files) {
        /* The array we'll be saving questions to */
        var questions = [];

        // Filter down to only quizzes
        var quizzes = files.filter(file => file.name.includes('quiz') && file.ext === '.xml');

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
                var mattexts, html, questionObject, regexRefs;

                mattexts = question.dom.find('mattext').map((i, mattext) => {
                    return $(mattext).text();
                }).get().join(' ____ ');

                html = he.decode(mattexts);
                if (html.length > 70) {
                    html = html.substr(0, 70) + '...';
                }

                questionObject = {
                    Quiz: $('assessment').attr('title'),
                    Number: question.number,
                    'Question Title': $(question).attr('title'),
                    Question: $.load(html).text().replace(/\s+/g, ' ')
                };

                regexRefs = question.dom.find('d2l_2p0\\:answer_is_regexp');
                // Get instance's parent, then sibling
                regexRefs.each((i, instance) => {
                    var regexExpression = $(instance).parent().prev().text();
                    var regexCount = Object.keys(questionObject).length - 3;
                    questionObject[`Regex${regexCount}`] = regexExpression;
                });
                questions.push(questionObject);
            });
        });

        return questions;
    }

    function writeCSV(questions) {

        // Put the question objects into CSV friendly format
        var csvString = d3.csvFormat(questions);

        // Write the CSV
        fs.writeFile(`./reports/${course.info.fileName.split('.zip')[0]} Regex Questions - ${course.info.D2LOU}.csv`, csvString, 'ASCII', (err) => {
            if (err) console.error(err);
            else {
                course.message(`Regex CSV for ${course.info.fileName} has been written.`);
                stepCallback(null, course);
            }
        });


    }

    questionList = getRegex(course.content);
    writeCSV(questionList);
};