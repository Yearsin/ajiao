const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const del = require('del');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cached = require('gulp-cached');
const browserSync = require('browser-sync');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const runSequence = require('gulp-sequence');
const filter = require('gulp-filter');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');


// 説明書:
// 开发时开启watch(gulp watch), 这样当css,js,html,mages有改变 自动执行(只需打开对应的页面F5下就是最新的更改)
// 版本号的控制: (默认使用)
// (1) 使用版本号: 53行 & 70行 不要注释   |   不使用版本号: 53行 & 70行 注释掉


// 代码的合并: (默认使用)
// (1) js代码合并:   112-116行代码 使用 (127行添加相应的任务concatJs)(必须)(输出的文件名可以自定义)     |   不使用 (127行相应的任务删掉)(必须)
// (2) css代码合并:  119-123行代码 使用 (142行添加相应的任务concatCss)(必须)(输出的文件名可以自定义)    |   不使用 (127行相应的任务删掉)(必须)


// 新建一个任务 参数一是任务的名称('任务名：html') 参数二是回调函数
gulp.task('html', () =>
    // 入口地址 
    gulp.src(['rev/views/**/*.html'])
    // 调用fileinclude方法 实现头尾等公共页面的复用(语法查看src/index.html)
        .pipe(fileinclude())
        // 出口地址
        .pipe(gulp.dest('dist/'))
);

// css压缩
gulp.task('css', () =>
    gulp.src('src/css/style.less')
        .pipe(less())
        // 添加 CSS 浏览器前缀,兼容最新的5个版本
        .pipe(autoprefixer('last 6 version'))
        // 调用方法进行css压缩
        .pipe(cleanCss())
        .pipe(gulp.dest('src/css'))
        // 调用方法生成版本号
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        // 生成hash的json文件
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
)

// js压缩
gulp.task('js', () =>
    gulp.src('src/js/*.js')
    // es6转化es5语法(命令cnpm install --save-dev gulp-babel babel-preset-es2015)(学习地址 http://www.cnblogs.com/sanxiaoshan/p/6850342.html )
        .pipe(babel({
            presets: ['es2015']
        }))
        // 调用方法进行js压缩
        .pipe(uglify())
        .pipe(filter(['**/*', '!**/*.min.js'])) // 筛选出管道中的非 *.min.js 文件
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))

        .pipe(filter(['**/*', '!**/*.min.js'])) // 筛选出管道中的非 *.min.js 文件
        // 生成hash的json文件
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
)
// minjs不压缩不增加版本号输出
gulp.task('minjs', () =>
    gulp.src('src/js/*.min.js')
        .pipe(gulp.dest('./dist/js'))
)

// 图片优化
gulp.task('image', () =>
    gulp.src('src/images/**/*.{png,jpg,gif,ico}')
    // 缓存当前任务中的图片,只让已修改的文件通过管道('参数为任务名')
        .pipe(cached('image'))
        // 调用方法进行图片优化
        .pipe(imagemin({
            progressive: true, // 是否无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}], //不移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/images'))
)

//静态资源版本控制(src/views 转化为有版本号的rev/views)(在命令行输入 gulp rev)
gulp.task('rev', () =>
    gulp.src(['rev/**/*.json', './src/views/**/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('./rev/views'))
)

// 清空目录
gulp.task('clean', () =>
    del(['./dist/*', './rev/*']));

//concatJs 合并JS文件
gulp.task('concatJs', () =>
    gulp.src(['src/js/lib/jquery.min.js','src/js/lib/PxLoader.js','src/js/lib/PxLoaderImage.js','src/js/lib/bootstrap.min.js','src/js/lib/swiper.min.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./dist/js'))
);

//concatCss 合并Css文件
// gulp.task('concatCss', () =>
//     gulp.src('src/css/*.css')
//     .pipe(concat('concatCss.css'))
//     .pipe(gulp.dest('./dist/css'))
// );

// dev 关连执行全部编译任务 一键串联执行
gulp.task('dev', function (cb) {
        runSequence('clean', ['js', 'css', 'image', 'concatJs', 'minjs'], 'rev', 'html')(cb);
    }
);

// 项目初始化
gulp.task('init', () =>
    del(['./dist/*', './rev/*', './src/css/*', './src/images/*', './src/js/*', './src/views/*'])
);

// html文件有变动则执行的任务
gulp.task('changeHtml', function (cb) {
        runSequence('rev', 'html')(cb);
    }
);

// css文件有变动则执行的任务
gulp.task('changeCss', function (cb) {
        runSequence('css', 'rev', 'html')(cb);
    }
);

// html文件有变动则执行的任务
gulp.task('changeJs', function (cb) {
        runSequence('js', 'rev', 'html')(cb);
    }
);

// watch 开启本地服务器并监听
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: 'dist' // 在 dist 目录下启动本地服务器环境,自动启动默认浏览器
        }
    })

    // 监控 CSS 文件,有变动则执行CSS注入
    gulp.watch('src/css/**/*.css', ['changeCss']);
    // 监控 js 文件,有变动则执行 js 任务
    gulp.watch('src/js/**/*.js', ['changeJs']);
    // 监控图片文件,有变动则执行 image 任务
    gulp.watch('src/images/**/*', ['image']);
    // 监控 html 文件,有变动则执行 html 任务
    gulp.watch('src/views/**/*', ['changeHtml']);
    // 监控 dist 目录下的变动,则自动刷新页面
    gulp.watch(['dist/**/*']).on('change', browserSync.reload);

});
