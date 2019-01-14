# ihook

[![Version npm][version]](http://browsenpm.org/package/ihook)

[version]: https://img.shields.io/npm/v/ihook.svg?style=flat-square

**ihook** is a Git hooks tool, it can install git hooks automatically and run your prepared tasks when a git hook is triggered.

## Install

It is adviced to install `ihook` as a `devDependencies` type, because it is usually used in development. Run the command below to install:

```
npm install --save-dev ihook
```

When `ihook` is installing, new hook files will be added into `.git/hooks` directory. If a hook exists already, `.old` suffix will be appended to it's file name. For example, `pre-commit` will be changed to `pre-commit.old`.

## Config

After installing, a `ihook.config.js` file will be created in the directory which contains `package.json`. It contains a simple config example as follows:

```
module.exports = {
    hooks: {
        'pre-commit': {
            tasks: [
                'echo ihook common task(from string config) is executed...',
                {
                    type: 'common',
                    command: 'echo ihook common task(from object config) is executed...'
                },
                {
                    type: 'batch',
                    filter: filepath => /\.js$/.test(filepath),
                    command: 'echo <paths>'
                },
                {
                    type: 'batch',
                    filter: {
                        extensions: ['.js'],
                        ignoreRuleFiles: ['.eslintignore']
                    },
                    command: 'eslint <paths>'
                }
            ]
        }
    }
};
```

Above config means：

All commands in `tasks` will be executed in sequence when `pre-commit` hook is triggered. If all commands complete successly (exit code is 0), `pre-commit` hook passes, `git commit` can commit successly. If any task fails (like eslint fails), `pre-commit` will fail, `git commit` can not commit.

### Introduction to "task"

Item of `tasks` has two types: `common` and `batch`, and it's config fields are:
- type: type of task
- command: command should be executed

**Notice：`batch` task is only supported in `pre-commit` hook**

#### Introduction to *common task*

There are two ways to configure common task:

- String style, for example：

```
'eslint .'
```

- Object style, for example：
```
{
    type: 'common',
    command: 'eslint .'
}
```



#### Introduction to *batch task*

It is used to extract file paths which is being committed, and use the file paths as command param. Notice:

- "command" must contain param token `<paths>`, for example:

```
{
    type: 'batch',
    command: 'echo <paths>'
}
```

- You can use `filter` to config a rule of excluding file paths. It can be a *string* or a *function*.

    - if `filter` is a function, it is used as a filter function. When it is called, it accept a file path, and the file path will be remained if it return `true`, else excluded.
        
        ```
        {
            type: 'batch',
            filter: filepath => /\.js$/.test(filepath),
            command: 'echo <paths>'
        }
        ```

    - if `filter` is an object, two config fields are available:
        - extensions: an array of extensions. If a file path's extension in the array, the file path will be remained, else excluded. Notice: each extension **must** start with ".". For example, below config will remain `.js` files only.

            ```
            {
                extensions: ['.js']
            }
            ```

        - ignoreRuleFiles: an array of filenames. It is used to assign some exclusionary rule (like .eslintignore, .gitignore). Notice: the assigned file **must** be in the directory which contains `package.json`. If you config `ignoreRuleFiles`, any file path will be excluded if it match the rule in the assigned files. For example, below config will remain `.js` files and exclude all files whose path match rules in `.eslintignore`.

            ```
            {
                filter: {
                    extensions: ['.js'],
                    ignoreRuleFiles: ['.eslintignore']
                }
            }
            ```

**Notice Again：`batch` task is only supported in `pre-commit` hook**

If you want know more about git hooks, please read:

http://githooks.com

### License

MIT