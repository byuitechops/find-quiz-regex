# Find Quiz Regex (D2L)
### *Package Name*: find-quiz-regex
### *Child Type*: Preimport (sort of)

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

This module identifies quiz questions within a D2L export that contain regex expression answers. This is not technically a child module, though it can (mostly) be used in conjunction with the course conversion tool. It can be used standalone as well, but requires a course object from the `create-course-object` module in order to run.

## How to Install

```
npm install find-quiz-regex
```

## Outputs

Produces a single CSV named after the course title, with `- Regex Questions` attached. This CSV has the following columns:

Quiz|Number|Question Title|Question|Regex1|Regex2|Regex...|
|-|-|-|-|-|-|-|
|The quiz title | The question number | The question title (which is often the actual question) | The question text | The first regex answer | The second regex answer | etc. |
## Process

Describe in steps how the module accomplishes its goals.

1. Retrieves all of the quiz XML files from the course object
2. Filters them down to ones containing regex
3. Pulls out the needed information from each one
4. Writes it all to a CSV
