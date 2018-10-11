# pre-commit-enhanced

[![Version npm][version]](http://browsenpm.org/package/pre-commit-enhanced)

[version]: https://img.shields.io/npm/v/pre-commit-enhanced.svg?style=flat-square

**pre-commit-enhanced**是基于[pre-commit](https://github.com/observing/pre-commit)开发的一款Git pre-commit钩子安装器. 它用于保证在你提交更改之前要先通过 `npm test` 或者其他自定义的脚本检验. 这些功能都可以方便的在你项目的 `package.json` 文件中配置.

但是别担心, 你仍然可以在提交文件时使用 `--no-verify` 或 `-n` 跳过 `pre-commit` 钩子, 从而进行强制提交.

### 安装

建议将 **pre-commit-enhanced** 作为 `package.json` 的 `devDependencies` 项来安装, 因为一般只需要在开发阶段才会用到本模块. 执行以下命令进行安装:

```
npm install --save-dev pre-commit-enhanced
```

若你的 `.git/hooks` 目录内已经存在 `pre-commit` 文件, 那么在本模块安装完后会用新的 `pre-commit` 文件覆盖它, 并且将原有的 `pre-commit` 重命名为 `pre-commit.old`.

### 配置

默认情况下, `pre-commit-enhanced` 会在含 `package.json` 文件的目录内执行 `npm test` 命令. 但如果 `package.json` 文件的 `test` 命令内容是执行 `npm init` 时所填充的初始值, 就不会执行它.

`pre-commit-enhanced` 不仅仅能够在pre-commit钩子运行期间执行 `npm test`, 它可以执行你在 `package.json` 的 "script" 字段中指定的任意命令. 因此可以在提交前确保:

- 代码达到100%覆盖率
- 所有的代码风格校验通过
- JSHint 校验通过
- 贡献许可签名等等.

而你只需在 `package.json` 中添加一个 `pre-commit` 数组指定需要执行哪些scripts以及它们的执行顺序:

```js
{
  "name": "437464d0899504fb6b7b",
  "version": "0.0.0",
  "description": "ERROR: No README.md file found!",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: I SHOULD FAIL LOLOLOLOLOL \" && exit 1",
    "foo": "echo \"fooo\" && exit 0",
    "bar": "echo \"bar\" && exit 0"
  },
  "pre-commit": [
    "foo",
    "bar",
    "test"
  ]
}
```

在上面的例子中, 它会先执行 `npm run foo`, 再执行 `npm run bar`, 最后执行 `npm run test`. 其中 `npm run test` 会使commit失败, 因为它返回了错误码 `1`. 如果你更喜欢用字符串来配置, 或者更喜欢使用不带横杠的 `precommit`, 你也可以这样配置:

```js
{
  "precommit": "foo, bar, test"
  "pre-commit": "foo, bar, test"
  "pre-commit": ["foo", "bar", "test"]
  "precommit": ["foo", "bar", "test"],
  "precommit": {
    "run": "foo, bar, test",
  },
  "pre-commit": {
    "run": ["foo", "bar", "test"],
  },
  "precommit": {
    "run": ["foo", "bar", "test"],
  },
  "pre-commit": {
    "run": "foo, bar, test",
  }
}
```

上面所有这些配置的效果都是一样的. 除了配置要执行的脚本, 你还可以配置以下选项:

- **silent** 布尔值, 默认为false. 若配置true, 则在运行失败或没有脚本可执行时, 不输出任何带 `pre-commit:` 前缀的提示信息.
- **colors** 布尔值, 默认为true. 若配置false, 则在输出信息时文字不带颜色.
- **template** 一个文件路径. 该文件的内容将被用作commit时的信息模板.

这些选项可以加在 `pre-commit`/`precommit`对象中, 也可用 `"pre-commit.{key}` 的格式配置在 `package.json` 中.

```js
{
  "precommit.silent": true,
  "pre-commit": {
    "silent": true
  }
}
```

以上两种配置的效果是一样的. 你可以根据项目实际情况选择合适的配置风格. 想了解更多关于scripts的信息, 请阅读 `npm` 官方文档:

https://npmjs.org/doc/scripts.html

想了解更多关于git钩子的信息, 请阅读:

http://githooks.com

### 许可证

MIT