var express = require('express');
var router = express.Router();

var question = require('./questionList.json');
var userInfo = require('./userInfo.json');
var total = require('./total.json');
var getQuestionList = require('./questionList.json');
var getattempts = require('./attempts.json');


/*
* 获取用户信息
* */
router.post('/getUserInfo', function(req, res, next) {

    res.send(userInfo);
});

/*
* 获取题目和问题
* */
router.post('/getQuestionList', function(req, res, next) {

    res.send(getQuestionList);
});

/*
* 获取统计人数
* */
router.post('/getattempts', function(req, res, next) {

    res.send(getattempts);
});


/*
* 获取大屏幕选手排名
* */
router.post('/total', function(req, res, next) {
    
        res.send(total);
    });
    

/*
* 获取问题信息
* */
router.post('/getQuestion', function(req, res, next) {
    console.log(req.body)
    var obj ={};
    var questionList = question.data;
    var index = req.body.ID-1;

    obj["status"] = true;
    obj["errmsg"] = "ok";
    obj["data"] = questionList[index];
    res.send(obj);
});

router.post('/saveAnswer', function(req, res, next) {
    console.log(typeof req.body)
    console.log(req.body)
    res.send({
        "status": true,
        "errmsg": "ok"
    });
});

module.exports = router;
