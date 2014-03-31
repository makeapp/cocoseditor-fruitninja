/**
 * @Name :
 * Common tool function
 *
 * @DevelopTool:
 * Cocos2d-x Editor (CocosEditor)
 *
 * @time
 * 2014-03-20 pm
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

cc.debug = function (msg)
{
    cc.log(msg);
};

cc.Animate.createWithName = function (name)
{
    return cc.Animate.create(cc.AnimationCache.getInstance().getAnimation(name));
};

cc.Animate.createWithTime = function (that, name, time)
{
    var cache = that.animationCache.getAnimation(name);
    cache.setDelayPerUnit(time);
    return cc.Animate.create(cache);
};

cc.CleanUp = {};
cc.CleanUp.create = function (sprite)
{
    return cc.CallFunc.create(function ()
    {
        sprite.cleanuped = true;
        sprite.removeFromParent(true);
    });
};


cc.TurnLeft = {};
cc.TurnLeft.create = function (sprite)
{
    return cc.CallFunc.create(function ()
    {
        var camera = sprite.getCamera();
        camera.setEye(0, 0, 1);
    });
};

cc.TurnRight = {};
cc.TurnRight.create = function (sprite)
{
    return cc.CallFunc.create(function ()
    {
        var camera = sprite.getCamera();
        camera.setEye(0, 0, -1);
    });
};

cc.Toast = {};
cc.Toast.create = function (node, message, delay)
{
    var director = cc.Director.getInstance();
    var size = director.getWinSize();
    var label = cc.LabelTTF.create(message, "Arial", 40);
    label.setPosition(size.width / 2, size.height / 2 + 100);
    label.setColor(cc.c3b(0, 0, 0));
    label.setZOrder(10000);
    node.addChild(label);
    label.runAction(cc.Sequence.create(cc.DelayTime.create(delay), cc.CleanUp.create(label)));
    return label;
};

cc.MySprite = {};
cc.MySprite.create = function (node, frameName, position, ZOrder)
{
    var sprite = cc.Sprite.createWithSpriteFrameName(frameName);
    sprite.setPosition(position);
    sprite.setZOrder(ZOrder)
    sprite.setAnchorPoint(cc.p(0.5, 0.5));
    node.addChild(sprite);
    return sprite;
};

cc.MySprite.createFlash = function (node, name, pBegin, pEnd)
{
    var flash = cc.MySprite.create(node, name, pEnd, 3000);
    var ratio = (pEnd.y - pBegin.y) / (pEnd.x - pBegin.x);
    var angle = (Math.atan(ratio) / (Math.PI)) * 180;
    flash.setRotation(-angle);
    flash.setScale(0.5);
    flash.runAction(cc.Sequence.create(cc.DelayTime.create(0.2), cc.CleanUp.create(flash)));
    return flash;
};

cc.rectCreate = function (p, area)
{
    return  cc.rect(p.x - area[0], p.y - area[1], area[0] * 2, area[1] * 2);
}

cc.BuilderReader.replaceScene = function (path, ccbName)
{
    var scene = cc.BuilderReader.loadAsSceneFrom(path, ccbName);
    cc.Director.getInstance().replaceScene(scene);
    return scene;
};

cc.BuilderReader.loadAsScene = function (file, owner, parentSize)
{
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild(node);
    return scene;
};


cc.BuilderReader.loadAsSceneFrom = function (path, ccbName)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.loadAsScene(path + "/" + ccbName);
    }
    else {
        return cc.BuilderReader.loadAsScene(ccbName);
    }
};

cc.BuilderReader.loadAsNodeFrom = function (path, ccbName, owner)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.load(path + "/" + ccbName, owner);
    }
    else {
        return cc.BuilderReader.load(ccbName, owner);
    }
};

cc.BuilderReader.runScene = function (module, name)
{
    var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsSceneFrom(module, name);
    var runningScene = director.getRunningScene();
    if (runningScene === null) {
        cc.log("runWithScene");
        director.runWithScene(scene);
    }
    else {
        cc.log("replaceScene");
        director.replaceScene(scene);
    }
};

cc.getRandomFromMax = function (maxSize)
{
    return Math.floor(Math.random() * maxSize) % maxSize;
};


String.prototype.isValid = function ()
{
    if (this == undefined || this == null) {
        return false;
    }
    else {
        return true;
    }
}

Array.prototype.contains = function (value)
{
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
}

Array.prototype.position = function (value)
{
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return i;
        }
    }
    return -1;
}

function getTimeFormat(time)
{
    if (time <= 9) {
        return "0" + time;
    }
    else {
        return "" + time;
    }
}

function getHourRemainTime(time)
{
    var t = time.split(/[- :]/);
    var expireDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var nowDate = new Date();
    var seconds = (expireDate.getTime() - nowDate.getTime()) / 1000;
    var iHour = Math.floor(seconds / 3600);
    var iMin = Math.floor((seconds - iHour * 3600) / 60);
    var iSen = Math.floor(seconds - iHour * 3600 - iMin * 60);
    var remainTime = getTimeFormat(iHour) + ":" + getTimeFormat(iMin) + ":" + getTimeFormat(iSen);
    return  remainTime;
}

function getMinuteRemainTime(time)
{
    var t = time.split(/[- :]/);
    var expireDate = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var nowDate = new Date();
    var seconds = (expireDate.getTime() - nowDate.getTime()) / 1000;
    var iHour = Math.floor(seconds / 3600);
    var iMin = Math.floor((seconds - iHour * 3600) / 60);
    var iSen = Math.floor(seconds - iHour * 3600 - iMin * 60);
    var remainTime = getTimeFormat(iMin) + ":" + getTimeFormat(iSen);
    return  remainTime;
}

function getRandom(maxSize)
{
    return Math.floor(Math.random() * maxSize) % maxSize;
}

function getRandomOffset(offset)
{
    return offset - getRandom(offset * 2);
}
