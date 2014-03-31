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


var StartLayer = function ()
{
    this.dojoRing = {};
    this.dojoFruit = {};
    this.newGameRing = {};
    this.newGameFruit = {};
    this.quitRing = {};
    this.quitFruit = {};

};

StartLayer.prototype.onDidLoadFromCCB = function ()
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

StartLayer.prototype.onEnter = function ()
{
    this.rings = [this.dojoRing, this.newGameRing, this.quitRing];
    for (var i = 0; i < this.rings.length; i++) {
        this.rings[i].runAction(cc.RepeatForever.create(cc.RotateBy.create(1, -90)));
    }

    this.fruits = [this.dojoFruit, this.newGameFruit, this.quitFruit];
    for (var j = 0; j < this.fruits.length; j++) {
        this.fruits[j].runAction(cc.RepeatForever.create(cc.RotateBy.create(5, 90)));
    }

    cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.menu, true);
    this.isFlash = false;
};


StartLayer.prototype.onTouchesBegan = function (touches, event)
{
    this.pBegin = touches[0].getLocation();
    if (cc.rectContainsPoint(this.quitFruit.getBoundingBox(), this.pBegin)) {
        if (sys.platform != 'browser') {
            cc.Director.getInstance().popScene();
        }
    }
};


StartLayer.prototype.onTouchesMoved = function (touches, event)
{
    var loc = touches[0].getLocation();
    if (cc.rectContainsPoint(this.newGameFruit.getBoundingBox(), loc)) {
        var sandiaImages = ["sandia-1.png", "sandia-2.png"];
        var fruitPosition = this.newGameFruit.getPosition();

        var san0 = cc.MySprite.create(this.rootNode, sandiaImages[0], fruitPosition, 100);
        var san1 = cc.MySprite.create(this.rootNode, sandiaImages[1], fruitPosition, 100);
        this.newGameFruit.runAction(cc.ScaleTo.create(0, 0));
        var rotation = this.newGameFruit.getRotation();
        cc.log("rotation==" + rotation);
        san0.setRotation(rotation);
        san1.setRotation(rotation);
        cc.AudioEngine.getInstance().playEffect(FRUIT_SOUNDS.splatter, false);

        var upSprite = san0;
        var downSprite = san1;
        var fruitX = fruitPosition.x;
        var fruitY = fruitPosition.y;
        upSprite.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.2, cc.p(fruitX - 50, fruitY + 50)),
                cc.CleanUp.create(upSprite)
        ));
        downSprite.runAction(cc.Sequence.create(
                cc.MoveTo.create(0.2, cc.p(fruitX + 50, fruitY - 50)),
                cc.CleanUp.create(downSprite)
        ));

        if (this.isFlash == false) {
            this.isFlash = true;
            cc.MySprite.createFlash(this.rootNode, "flash.png", this.pBegin, loc);
        }

        this.rootNode.scheduleOnce(function ()
        {
            cc.AudioEngine.getInstance().stopAllEffects();
            cc.BuilderReader.runScene("", "MainLayer");
        }, 0.5);
    }
}

StartLayer.prototype.onTouchesEnded = function (touches, event)
{

};
