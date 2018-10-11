TODO:

2018.10.10

1. batch模式不再需要执行npm run pce-install-batch后才能使用, 直接通过配置文件来声明
2. 是开一个新的仓库, 还是从现有仓库升级大版本? 有待决定..
3. 配置文件名: pce.config.js    内容如下:

```
module.exports = {
    hooks: {
        "pre-commit": {
            tasks: [
                "npm test", // 普通模式
                {
                    // 普通模式, 自定义了一些配置项
                    mode: 'common',
                    command: 'npm run coverage',
                    cwd: __dirname
                },
                {
                    // batch模式
                    mode: 'batch',
                    command: 'eslint <paths>',
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
command: 要执行的命令
cwd: 执行命令时的当前工作目录 (此项是否要做支持? 待确定..)

batch模式的task的配置项有:
command中的<paths>是文件路径参数占位符
filter: 过滤器函数, 或者'.eslintignore'之类的字符串来表示用该文件作为排除列表
useRelativePath: <paths>参数中的路径是否用相对路径

4. pce.config.js的hooks设计为一个对象, 为后续支持其他钩子(如pre-push)预留可扩展空间

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



