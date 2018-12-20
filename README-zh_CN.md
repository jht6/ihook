# ihook

[![Version npm][version]](http://browsenpm.org/package/ihook)

[version]: https://img.shields.io/npm/v/ihook.svg?style=flat-square

**ihook**是一个Git钩子工具，它可以帮你自动安装Git钩子，并根据你的配置在钩子触发时执行你预设的任务。

## 安装

建议将ihook作为 `devDependencies` 类型的依赖项，因为它主要是在项目开发过程中使用。执行以下命令进行安装：

```
npm install --save-dev ihook
```

安装时，新的钩子文件会添加进`.git/hooks` 目录。如果 `.git/hooks` 目录中存在已有的Git钩子，则会为原有的钩子文件增加 `.old` 后缀, 例如将 `pre-commit` 改为 `pre-commit.old`。

## 配置

安装完成后，在含package.json的目录内（以下简称pkgJsonDir）会生成 `ihook.config.js` 配置文件，内含几个简单的示例，内容如下：

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

以上配置的含义为：
在触发 `pre-commit` 钩子（执行 `git commit` 就会触发）时要依次执行tasks内所列出的命令。当所有命令都正常执行完成（即进程退出码为0）后，`pre-commit`钩子通过，`git commit` 操作得以成功执行。若某项task执行失败（例如eslint校验未通过），`pre-commit` 钩子未通过，`git commit` 操作就执行失败。

### task介绍

task分为 `common` 和 `batch` 两种类型，配置字段有：
* type: task类型
* command: task要执行的命令

**注意：`batch` 类型任务当前只支持在 `pre-commit` 钩子中配置使用。**

#### common类型

用于配置要执行的命令, 支持两种声明方式：

1. 字符串形式，例如：

```
'eslint .'
```

2. 对象形式， 例如：
```
{
    type: 'common',
    command: 'eslint .'
}
```

以上两种声明方式是等价的。

#### batch类型

用于提取出commit时要提交的文件路径列表并作为执行命令的参数，注意：

1. command中必须含有参数占位符 `<paths>`，例如：

```
{
    type: 'batch',
    command: 'echo <paths>'
}
```

2. 可以使用filter指定文件路径的过滤规则，满足规则的才会被保留下来并作为命令参数。filter支持 *函数* 和 *对象* 两种形式的配置。

若 `filter` 声明为函数，该函数会被用于过滤文件路径列表。它每次被调用时会接收一个文件路径，若它返回true则该文件路径会保留，否则会被剔除。例如下面的配置会使输出内容中只含 `.js` 类型文件的路径：
```
{
    type: 'batch',
    filter: filepath => /\.js$/.test(filepath),
    command: 'echo <paths>'
}
```

若 `filter` 声明为对象，则有两个可选配置可以使用：
* extensions：一个包含扩展名的数组。如果一个文件路径的扩展名在extensions中存在，则该路径被保留，否则就会被剔除。注意：每项扩展名 **必须** 以"."开头。例如以下配置只会保留路径列表中 `.js` 类型文件的路径：

```
{
    extensions: ['.js']
}
```

* ignoreRuleFiles：一个包含文件名的数组，用于指定一组含排除规则的文件（例如.eslintignore, .gitignore这种）。注意：所指定的文件 **必须** 存在于pkgJsonDir目录内（这也是通常.eslintignore所在的位置）。若配置了此项，ihook会根据所指定文件内声明的规则将一些文件路径排除掉。例如以下配置会只保留 `.js` 类型文件的路径且排除掉所有被 `.eslintignore` 内规则命中的路径：

```
{
    filter: {
        extensions: ['.js'],
        ignoreRuleFiles: ['.eslintignore']
    }
}
```

**再次提醒：`batch` 类型任务当前只支持在 `pre-commit` 钩子中配置使用。**


想了解更多关于git钩子的信息, 请阅读:

http://githooks.com

### 许可证

MIT