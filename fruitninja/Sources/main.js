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


if (sys.platform == 'browser') {
    var require = function (file)
    {
        var d = document;
        var s = d.createElement('script');
        s.src = file;
        d.body.appendChild(s);
    }
}
else {
    require("jsb.js");
}

var ccb_resources = [
    {src: "res/fruit.plist"},
    {src: "res/main.plist"},
    {src: "res/fruit.png"},
    {src: "res/main.png"},

    {src: "res/fonts/character.png"},
    {src: "res/fonts/font4.fnt"},
    {src: "res/fonts/font6.fnt"},
    {src: "res/fonts/font10.fnt"},
    {src: "res/fonts/s_number_gold.fnt"},
    {src: "res/fonts/s_number_gold.png"},
    {src: "res/fonts/s_number_member_small.png"},

    {src: "res/background.jpg"},
    {src: "res/home-mask.png"}
];

FRUIT_STRINGS={
    bestScore:"最佳成绩：",
    youGet:"本次您获得了",
    score:"分",
    record:",新记录！"

}

FRUIT_SOUNDS = {
    boom: "res/sounds/boom.mp3",
    menu: "res/sounds/menu.mp3",
    over: "res/sounds/over.mp3",
    splatter: "res/sounds/splatter.mp3",
    start: "res/sounds/start.mp3",
    throw: "res/sounds/throw.mp3"
};


require("CocosEditor.js")
require("StartLayer.js");
require("MainLayer.js");

if (sys.platform == 'browser') {

    var Cocos2dXApplication = cc.Application.extend({
        config: document['ccConfig'],
        ctor: function ()
        {
            this._super();
            cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(this.config['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function ()
        {
            var director = cc.Director.getInstance();
            // director->enableRetinaDisplay(true);
            // director.setDisplayStats(this.config['showFPS']);
            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / this.config['frameRate']);
            var glView = director.getOpenGLView();
            glView.setDesignResolutionSize(640, 480, cc.RESOLUTION_POLICY.SHOW_ALL);
            cc.Loader.preload(ccb_resources, function ()
            {
                cc.BuilderReader.runScene("", "StartLayer");
            }, this);
            return true;
        }
    });
    var myApp = new Cocos2dXApplication();
}
else {
    cc.BuilderReader.runScene("", "StartLayer");
}