# Dash Dataset

Dash Dataset能够将Dash的documentation sets直接添加到utools中直接搜索，目前只支持单个数据集搜索。

features:
- 支持搜索时快捷选择，使用`Tab`或者`上下箭头`按键可以上下选择搜索结果
- 支持页内搜索，在搜索选中页面后使用`空格`进入页内搜索

## 使用步骤

### 1、添加数据集

输入关键字`dataset`进入设置页面。添加一个数据集需要填写三个信息：名称、key、数据集目录。
- 名称是改数据集的描述，例如：mongodb文档、JavaScript文档等。
- key是用于触发文档搜索的功能关键字，不同的文档不能够重复。
- 数据集目录是安装后数据目录地址（以zeal下载安装的为例：xxx/zeal/docsets/MongoDB.docset），在点击添加按钮后会自动检查，不符合规范不能添加。

### 2、数据集下载

Dash原本是Mac下的应用，数据集在Windows机器上可以通过开源软件`zeal`（zeal也是兼容的Dash数据集）下载。数据集目录下面是有一个`Contents`目录，一般还会有icon以及`meta.json`文件。
