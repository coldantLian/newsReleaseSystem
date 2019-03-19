const express = require('express')
const nextJS = require('next')
var path = require('path');
const dev = process.env.NODE_ENV !== 'production'
const next = nextJS({ dev })
//app布置到全局
global.next = next;
const handle = next.getRequestHandler()
//支持post提交
var bodyParser = require('body-parser');

//引入数据库和配置
const mongoose = require("mongoose");
const config = require("./config.js");

const ueditorServer = require("./ueditorServer");

/* 数据库配置 */
// 数据库加载**************************** begin ****************
//引入mongoose
//引入mongoose模块
const models = path.join(__dirname, config.modelPath);

mongoose.Promise = global.Promise;
fs.readdirSync(models)
    .filter(file => {
        return ~file.indexOf('.js');
    }).forEach(file => {
        console.log("引入", path.join(models, file));
        require(path.join(models, file))
    });
//连接数据库
mongoose.connect(config.db_connection, { useMongoClient: true });
// 数据库加载**************************** end ****************
 
/* 引入路由中间件 */
const admin = require("./app/admin");
const website = require("./app/website");

next.prepare()
    .then(() => {
        const server = express();
        // 添加 body-parser 中间件就可以了
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());

        //注册静态目录
        server.use(express.static(path.join(__dirname, 'public')));
        server.use(express.static(path.join(__dirname, 'static')));

        /*后台路由设置 begin ******************  */

        server.all("*", (req, res, next) => {
            console.log(`被访问地址：${req.originalUrl}`);
            //让接口支持跨域请求
            res.header("Access-Control-Allow-Origin", "*"); //设置跨域访问
            //设置请求头可以加传token等字段
            res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , token');
            next();
        });

        server.use("/admin", admin);

        //UE组件服务入口
        server.use("/ueditor/ue", ueditorServer);

        /*后台路由设置 end ******************  */


        /*前台路由设置 begin ******************  */
        server.use("/", website);


        /*前台路由设置 end ******************  */
        //   server.get('/a', (req, res) => {
        //     return app.render(req, res, '/b', req.query)
        //   })

        //   server.get('/b', (req, res) => {
        //     return app.render(req, res, '/a', req.query)
        //   })

        //   server.get('*', (req, res) => {
        //     return handle(req, res)
        //   })

        server.listen(3001, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3001')
        })
    })