/**
 * @GameName :
 * Fruit Ninja
 *
 * @DevelopTool:
 * Cocos2d-x Editor (CocosEditor)
 *
 * @time
 * 2014-03-29 pm
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 * @Authors:
 * Programmer: touchSnow
 *
 * @Links:
 * http://www.cocos2d-x.com/ (cocos官方)
 * https://github.com/makeapp      （github）
 * http://blog.csdn.net/touchsnow (csdn博客)
 * http://blog.makeapp.co/ （官方博客）
 * http://www.cocoseditor.com/ （建设中官网）
 *
 * @Contact
 * 邮箱：zuowen@makeapp.co
 * qq群：232361142
 *
 */


FRUIT_DATA = [
    {
        num: 0,
        score: 1,
        fruitImage: "apple.png",
        cutImage: ["apple-1.png", "apple-2.png"]
    },
    {
        num: 1,
        score: 2,
        fruitImage: "banana.png",
        cutImage: ["banana-1.png", "banana-2.png"]
    },
    {
        num: 2,
        score: 2,
        fruitImage: "basaha.png",
        cutImage: ["basaha-1.png", "basaha-2.png"]
    },
    {
        num: 3,
        score: 3,
        fruitImage: "peach.png",
        cutImage: ["peach-1.png", "peach-2.png"]
    },
    {
        num: 4,
        score: 5,
        fruitImage: "sandia.png",
        cutImage: ["sandia-1.png", "sandia-2.png"]
    },
    {
        num: 5,
        score: 0,
        fruitImage: "boom.png",
        cutImage: "boomlight1.png"
    }
];


START = 0;
PAUSE = 1;
OVER = 2;

var MainLayer = function ()
{
    cc.log("MainLayer")
    this.fruitZOrder = 1000;
    this.lastFruitTime = 0;
    this.currentTime = 0;
    this.fruitList = [];
    this.totalScore = 0;
    this.totalTime = 60;
    this.remainTime = 60;
    this.totalScoreFont = {};
    this.totalTimeFont = {};
    this.bestScoreLabel = {};
    this.pause = {};
    this.back = {};
    this.overLayer = {};
    this.overScoreLabel = {};
};

MainLayer.prototype.onDidLoadFromCCB = function ()
{
    if (sys.platform == 'browser') {
        this.onEnter();
    }
    else {
        this.rootNode.onEnter = function ()
        {
            this.controller.onEnter();
        };
    }
    this.rootNode.schedule(function (dt)
    {
        this.controller.onUpdate(dt);
    });


    this.rootNode.onTouchesBegan = function (touches, event)
    {
        this.controller.onTouchesBegan(touches, event);
        return true;
    };

    this.rootNode.onTouchesMoved = function (touches, event)
    {
        this.controller.onTouchesMoved(touches, event);
        return true;
    };
    this.rootNode.onTouchesEnded = function (touches, event)
    {
        this.controller.onTouchesEnded(touches, event);
        return true;
    };
    this.rootNode.setTouchEnabled(true);
};

MainLayer.prototype.onEnter = function ()
{
    this.gameStatus = START;
    cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.start, false);
    this.newFruit();

    //bestScore
    this.bestScore = sys.localStorage.getItem("bestScore");
    if (this.bestScore != null && this.bestScore != undefined) {
        this.bestScore = Number(this.bestScore);
    }
    else {
        this.bestScore = 0;
    }
    cc.log("bestScore==" + this.bestScore);
    this.bestScoreLabel.setString(FRUIT_STRINGS.bestScore + this.bestScore);
    this.overLayer.setVisible(false);

}

MainLayer.prototype.onUpdate = function (dt)
{
    if (this.gameStatus == OVER) {
        return;
    }

    this.currentTime += dt;
    if (this.remainTime >= 0) {
        this.remainTime = 60 - Math.floor(this.currentTime);
        if (this.remainTime <= 0) {
            this.remainTime = 0;
        }
        this.totalTimeFont.setString(this.remainTime);
    }

    if (this.remainTime <= 0) {
        this.gameStatus = OVER;
        this.gameOver();
    }

    if (this.currentTime - this.lastFruitTime > 0.5) {
        this.newFruit();
        this.lastFruitTime = this.currentTime;
    }
}

MainLayer.prototype.newFruit = function ()
{
    //create new fruit per 0.5s
    var random = getRandom(FRUIT_DATA.length);
    var data = FRUIT_DATA[random];
    var fruit = cc.Sprite.createWithSpriteFrameName(data.fruitImage);
    var x = 300 + getRandomOffset(200);
    fruit.setPosition(cc.p(x, -100));
    fruit.setAnchorPoint(cc.p(0.5, 0.5));
    this.fruitZOrder -= 1;
    fruit.setZOrder(this.fruitZOrder);
    fruit.cleanuped = false;
    fruit.num = data.num;
    var offSetX = getRandomOffset(100);
    var topY = 900 + getRandom(100);
    var controlPoints = [
        cc.p(x, -100),
        cc.p(x - offSetX, topY),
        cc.p(x - offSetX * 2, -100)
    ];
    var fruitTime = 3;
    var bezier = cc.BezierTo.create(fruitTime, controlPoints);
    var action2 = cc.RotateBy.create(fruitTime, getRandom(360));
    var upActions = cc.Spawn.create(cc.Sequence.create(bezier, cc.CleanUp.create(fruit)), action2);
    fruit.runAction(upActions);
    this.rootNode.addChild(fruit);
    this.fruitList.push(fruit);
    cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.throw, false);
};

MainLayer.prototype.newSliceFruit = function (num, fruitPosition, rotation)
{
    //one fruit sliced two piece,cut1 and cut2
    var data = FRUIT_DATA[num];
    var cutImages = data.cutImage;
    var cut1 = cc.MySprite.create(this.rootNode, cutImages[0], fruitPosition, 100);
    var cut2 = cc.MySprite.create(this.rootNode, cutImages[1], fruitPosition, 100);
    cut1.setRotation(rotation);
    cut2.setRotation(rotation);

    var controlPoints1 = [
        fruitPosition,
        fruitPosition,
        cc.p(fruitPosition.x - 200, -100)
    ];
    var bezier1 = cc.BezierTo.create(1, controlPoints1);

    var controlPoints2 = [
        fruitPosition,
        fruitPosition,
        cc.p(fruitPosition.x + 200, -100)
    ];
    var bezier2 = cc.BezierTo.create(1, controlPoints2);

    var action2 = cc.RotateBy.create(1, getRandom(360));
    cut1.runAction(cc.Spawn.create(cc.Sequence.create(bezier1, cc.CleanUp.create(cut1)), action2));
    cut2.runAction(cc.Spawn.create(cc.Sequence.create(bezier2, cc.CleanUp.create(cut2)), action2.clone()));


    //fruit shadow
    /*var shadowImages = ["shadow2.png"];
     var colors = [cc.c4b(200, 0, 0, 20), cc.c4b(0, 200, 0, 20), cc.c4b(0, 0, 200, 20), cc.c4b(200, 200, 0, 20)];
     var shadow = cc.MySprite.create(this.rootNode, shadowImages[getRandom(shadowImages.length)], fruitPosition, 10);
     shadow.setColor(colors[getRandom(colors.length)]);
     shadow.setScale(0.5);
     shadow.runAction(cc.Sequence.create(cc.DelayTime.create(2), cc.CleanUp.create(shadow)));*/

};


MainLayer.prototype.gameOver = function ()
{
    cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.over, false);
    this.overLayer.setZOrder(1000);
    this.overLayer.setVisible(true);

    var gameScoreTip = FRUIT_STRINGS.youGet + this.totalScore + FRUIT_STRINGS.score;
    cc.log("this.totalScore=" + this.totalScore);
    cc.log("this.bestScore=" + this.bestScore);
    if (this.totalScore > this.bestScore) {
        cc.log("this.bestScore=" + this.bestScore);
        sys.localStorage.setItem("bestScore", this.totalScore + "");
        gameScoreTip = gameScoreTip + FRUIT_STRINGS.record;
    }
    this.overScoreLabel.setString(gameScoreTip);

    this.overLayer.scheduleOnce(function ()
    {
        cc.AudioEngine.getInstance().stopAllEffects();
        cc.BuilderReader.runScene("", "StartLayer");
    }, 6);

};


MainLayer.prototype.scoreTip = function (p, message)
{
    var director = cc.Director.getInstance();
    var size = director.getWinSize();
    var label = cc.LabelTTF.create(message, "Arial", 30);
    label.setPosition(cc.p(p.x, p.y + 50));
    label.setColor(cc.c3b(0, 255, 0));
    label.setZOrder(10000);
    this.rootNode.addChild(label);
    label.runAction(cc.Sequence.create(cc.DelayTime.create(0.8), cc.CleanUp.create(label)));
    return label;
};

MainLayer.prototype.onTouchesBegan = function (touches, event)
{
    if (this.gameStatus == OVER) {
        return;
    }

    //return menu
    this.pBegin = touches[0].getLocation();
    var backRect = cc.rectCreate(this.back.getPosition(), [50, 30]);
    if (cc.rectContainsPoint(backRect, this.pBegin)) {
        this.back.runAction(cc.Sequence.create(cc.ScaleTo.create(0.2, 1.2),
                cc.CallFunc.create(function ()
                {
                    cc.AudioEngine.getInstance().stopAllEffects();
                    cc.BuilderReader.runScene("", "StartLayer");
                })
        ));
    }
};


MainLayer.prototype.onTouchesMoved = function (touches, event)
{
    if (this.gameStatus == OVER) {
        return;
    }

    var loc = touches[0].getLocation();
    for (var i = 0; i < this.fruitList.length; i++) {
        var fruit = this.fruitList[i];
        if (fruit && fruit.cleanuped == false) {
            if (cc.rectContainsPoint(fruit.getBoundingBox(), loc)) {

                //if bomb
                if (fruit.num == 5) {
                    this.gameStatus = OVER;
                    cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.boom, false);
                    var light = cc.MySprite.create(this.rootNode, FRUIT_DATA[5].cutImage, loc, 1100);
                    light.runAction(cc.Sequence.create(
                            cc.Spawn.create(cc.ScaleTo.create(2, 10), cc.RotateBy.create(1, 360)),
                            cc.CleanUp.create(light),
                            cc.CallFunc.create(function ()
                            {
                                this.gameOver();
                            }, this)
                    ));
                    return;
                }

                //splatter audio
                cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.splatter, false);


                //flash
                var flash = cc.MySprite.createFlash(this.rootNode, "flash.png", this.pBegin, loc);

                //Fruit Slice
                this.newSliceFruit(fruit.num, fruit.getPosition(), flash.getRotation());
                fruit.runAction(cc.ScaleTo.create(0, 0));
                fruit.cleanuped = true;

                //scoreTip
                var fruitScore = FRUIT_DATA[fruit.num].score;
                this.scoreTip(fruit.getPosition(), fruitScore + "");

                this.totalScore += Number(fruitScore);
                this.totalScoreFont.setString(this.totalScore);
            }
        }
        else {
            this.fruitList.splice(i, 1);
        }
    }
};


MainLayer.prototype.onTouchesEnded = function (touches, event)
{

};

