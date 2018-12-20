
2018.12.20
getFilePathList()的过滤问题

相关资料：
https://backlog.com/git-tutorial/git-workflow/
https://git-scm.com/docs/git-status

=========================

2018.12.19
TODO:
(Done) 1. task执行失败时，若可以加-n参数， 应打出该提示。 （scripts/run/index.js）
(Done) 2. 非pre-commit钩子的task不支持batch类型task，应对ihook.config.js做检查。
(Done) 3. 安装时，若已存在ihook.config.js， 则不覆盖已有文件。
(Done) 4. 默认ihook.config.js的配置如何设置。

==========================

2018.12.17
关于 [npm run] 的执行流程:
npm run lint -> 执行c/program file/nodejs/npm -> node ./node_modules/npm/bin/npm-cli.js ->
./node_modules/npm/lib/run-script.js -> npm/node_modules/npm-lifecycle/index.js

最终是调用child_process.spawn()创建子进程执行命令：
spawn(
    'C:\Windows\system32\cmd.exe',
    ['/d /s /c', 'eslint .'],
    {
        cwd: 'C:\code\ihook',
        env: {
            ...,
            PATH: '...内含C:\code\ihook\node_modules\.bin'
        },
        stdio: [0, 1, 2],
        windowsVerbatimArguments: true
    }
);


而execa.shellSync()最终也是调用child_process.spawn()创建子进程执行命令：
spawn(
    'C:\Windows\system32\cmd.exe',
    ['/d', '/s', '/c', '"eslint ."'],
    {
        buffer: true
        cleanup: true
        cwd: "C:\code\ihook"
        encoding: "utf8"
        env: {
            PATH: 'C:\code\ihook\node_modules\.bin;C:\code\node_modules\.bin;C:\node_modules\.bin;C:\Program Files\nodejs;...'
        }
        extendEnv: true
        localDir: "C:\code\ihook"
        maxBuffer: 10000000
        preferLocal: true
        reject: true
        stdio: [null, null, null]
        stripEof: true
        windowsVerbatimArguments: true
    }
);


==============================
TODO:

2018.10.10

1. batch模式不再需要执行npm run pce-install-batch后才能使用, 直接通过配置文件来声明
2. 配置文件名: ihook.config.js    内容如下:

```
module.exports = {
    hooks: {
        "pre-commit": {
            tasks: [
                "npm test", // 普通模式
                {
                    // 普通模式, 自定义了一些配置项
                    mode: 'common',
                    cmd: 'npm run coverage'
                },
                {
                    // batch模式
                    mode: 'batch',
                    cmd: 'eslint <paths>',
                    filter: item => /\.js$/.test(item),
                    useRelativePath: true
                }
            ]
        }
    }
}
```

每个task公共配置项有:
mode: 'common' 或 'batch'
cmd: 要执行的命令
cwd: 暂不支持配置项, 但代码设计时需要预留获取cwd的接口, 以便需要时进行修改.

batch模式的task的配置项有:
cmd中的<paths>是文件路径参数占位符
filter: 过滤器函数, 或者['.eslintignore', '.gitignore']之类的数组来表示用该文件列表作为排除列表
useRelativePath: <paths>参数中的路径是否用相对路径

4. ihook.config.js的hooks设计为一个对象, 为后续支持其他钩子(如pre-push)预留可扩展空间

============================

1. 增加对运行命令的计时功能, 输出内容包括: 各命令所用时间, 所有命令消耗的总时间 (index.js中已支持, foreach中尚未支持))
2. 对所提交的文件路径集合进行处理的代码模板pce-batch.js, 提供可编程支持, 能够灵活处理所有场景
    一个使用eslint的完整场景为:
    1) git commit
    2) 触发pre-commit钩子, 调用"pce-batch", 继而执行pce-batch.js
    3) 拿到commit的文件列表
    4) 过滤, 只js文件
    5) 拼凑成形如"eslint path1 path2"的命令, 使用child_process.execSync执行

3. 完整场景的回归测试:
    0) 提前预设好测试的目录结构(含.gitignore, package.json), 主要含两种:
        一是: 普通场景, 即单纯的前端项目, package.json就在git仓库根目录
        .
        └── root
            ├── .git
            ├── node_modules
            └── package.json

        二是: 复杂场景, 即前端代码不在git仓库根目录, 而在子目录中, 例如:
        .
        └── root
            ├── .git
            └── ui
                ├── node_modules
                │   └── xxx
                ├── src
                │   └── xxx
                └── package.json
    
    普通场景的已完成, 复杂场景的后面处理.



