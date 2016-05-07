/**
 * Created by memee on 16/5/2.
 */
module.exports = {
    /**
     * 日期转换
     * */
    parseTime: function(date) {
        date = date || Date.now();
        var str = '';
        var timetext = (Date.now() - date);
        timetext = timetext < 0 ? 0 : timetext;
        if (timetext < 60) {
            str = '刚刚';
        }
        else if(timetext >=60 && timetext < 3600) {
            str = Math.round(timetext / 60) + '分钟前';
        }
        else if(timetext >=3600 && timetext < 86400) {
            str = Math.round(timetext / 3600) + '小时前';
        }
        else if(timetext >= 86400 && timetext < 2592000) {
            str = Math.round(timetext / 86400) + '天前';
        }
        else if(timetext > 2592000) {
            str = Math.round(timetext / 86400) + '月前';
        }
        return str;
    }

};