
//配置文档，用于配置程序启动所需的基本信息
module.exports = {
    // 数据库链接
    db_connection: "mongodb://127.0.0.1:27017/c2_website",
    // mongoose的model定义文件存放路径
    modelPath: "/app/db_models",
    adminNav: [
        { title: "总览", icon: "user", url: "/" },
        { title: "发布内容", icon: "user", url: "/content_add" },
        {
            title: "内容管理",
            icon: "user",
            children: [
                { title: "内容列表", icon: "user", url: "/content_list" }
            ]
        },
        { title: "单页管理", icon: "user", url: "/simple_page" },
        { title: "广告管理", icon: "user", url: "/ad" },
        { title: "管理员设置", icon: "user", url: "/manager", is_admin: true },
        {
            title: "网站配置",
            icon: "user",
            children: [
                { title: "频道设置", icon: "user", url: "/channel" },
                { title: "内容分类管理", icon: "user", url: "/content_sort" },
                { title: "网站信息设置", icon: "user", url: "/websit_config" }

            ]
        },
    ]

}