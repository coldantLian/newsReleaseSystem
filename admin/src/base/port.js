export default {
    server: "",
    base: {
        login: "/admin/login",
        get_manager_of_token:"/admin/manager/get_manager_of_token",
        edit_id_and_password:"/admin/manager/edit_id_and_password",
        upload: "/admin/upload",
        setConfig: "/admin/config",
        getConfig: "/admin/config",
        checkLogin:"/admin/checkLogin",
        navList:"/admin/navList"
    },
    content: {
        content_sort: {
            list: "/admin/content_sort/sortList",
            create: "/admin/content_sort/createSort",
            remove: "/admin/content_sort/removeSort",
            update: "/admin/content_sort/updateSort",
            order: "/admin/content_sort/orderSort"

        },
        create: "/admin/content/create",
        update: "/admin/content/update",
        remove: "/admin/content/remove",
        show: "/admin/content/show",
        comment: "/admin/content/comment",
        getList: "/admin/content/list",
        getOne: "/admin/content/getOne"
    },
    simple_page: {
        list: "/admin/simple_page/list",
        create: "/admin/simple_page/create",
        remove: "/admin/simple_page/remove",
        update: "/admin/simple_page/update"
    },
    channel: {
        list: "/admin/channel/list",
        create: "/admin/channel/create",
        remove: "/admin/channel/remove",
        update: "/admin/channel/update",
        order: "/admin/channel/order",
        getModuleTree: "/admin/channel/get_module_tree"
    },
    ad: {
        list: "/admin/ad/list",
        create: "/admin/ad/create",
        remove: "/admin/ad/remove",
        update: "/admin/ad/update"
    },
    manager:{
        list: "/admin/manager/list",
        create: "/admin/manager/create",
        remove: "/admin/manager/remove",
        update: "/admin/manager/update"
    },
    charts:{
        content_sort_count:"/admin/chart/pic_content_sort_count",
        content_sort_hits:"/admin/chart/pic_sort_hits"
    }
}