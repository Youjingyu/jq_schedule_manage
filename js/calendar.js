$(document).ready(function () {
    $.getJSON('test_data.json', function (schedule_data) {
        // 假数据
        var date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        schedule_data[year][month]['5'] = [
            {
                theme: '项目加班',
                content: '抓紧解决遗留问题',
                allDay: 1,
                level: 4
            },
            {
                start: '18:00',
                end: '19:00',
                theme: '部门周报',
                content: '总结本周工作',
                allDay: 0,
                level: 2
            }
        ];
        schedule_data[year][month]['20'] = [
            {
                start: '9:00',
                end: '11:30',
                theme: '每月总结',
                content: '当月工作总结',
                allDay: 0,
                level: 3
            }
        ];
        initDateBox();

        function initDateBox() {
            var html = '',
                date = new Date(),
                cur_date = {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                    type: 'month'
                };
            $('#calendar').find('.date-now').data('data', cur_date);
            for (var i = 1; i < 43; i++) {
                html += '<div class="date-box"><div class="date-content"><div class="date-text"><div class="date-num"></div><div class="date-schedule"></div></div></div></div>';
            }
            $('#calendar_month_tab').find('.month-tab-content').html(html);
            fillDateBox(schedule_data);
        }

        function getDateData(date_obj, type) {
            var cur_date;
            if (type == 'days') {
                cur_date = new Date(date_obj.year, date_obj.month, 0);
                return cur_date.getDate();
            } else if (type == 'week_1th') {
                cur_date = new Date(date_obj.year, date_obj.month, 1);
                return cur_date.getDay();
            } else if (type == 'cur_week') {
                cur_date = new Date(date_obj.year, date_obj.month, date_obj.day);
                return cur_date.getDay();
            }
        }


        function fillCalendarHead(type) {
            var $date_now = $('#calendar').find('.date-now'),
                cur_date = $date_now.data('data');
            if (type == 'month') {
                cur_date.type = 'month';
                $date_now.text(cur_date.year + '年' + switchMonthToEn(cur_date.month) + '月');
            } else if (type == 'week') {
                cur_date.type = 'week';
                var cur_week = getDateData(cur_date, 'cur_week'),
                    sat_date = new Date(cur_date.year, cur_date.month, cur_date.day),
                    sun_date = new Date(cur_date.year, cur_date.month, cur_date.day);
                sat_date.setDate(sat_date.getDate() + (6 - cur_week));
                sun_date.setDate(sun_date.getDate() - cur_week);
                var date_now_text = '';
                if (sat_date.getFullYear() == sun_date.getFullYear()) {
                    date_now_text = switchMonthToEn(sun_date.getMonth()) + '月' + sun_date.getDate();
                    if (sun_date.getMonth() == sat_date.getMonth()) {
                        date_now_text += '-' + sat_date.getDate() + '日';
                    } else {
                        date_now_text += '日-' + switchMonthToEn(sat_date.getMonth()) + '月' + sat_date.getDate() + '日';
                    }
                    date_now_text = sat_date.getFullYear() + '年' + date_now_text;
                } else {
                    date_now_text = sun_date.getFullYear() + '年' + switchMonthToEn(sun_date.getMonth()) + '月' + sun_date.getDate() +
                        '日-' + sat_date.getFullYear() + '年' + switchMonthToEn(sat_date.getMonth()) + '月' + sat_date.getDate() + '日';
                }
                $date_now.text(date_now_text);
                // 在week的head部分绑定日期
                var year_str, month_str, date_str,
                    $week_head = $('.week-head>div');
                $('.week-tab-content>.week-tab-col').each(function (i) {
                    if (i > 0) {
                        sun_date.setDate(sun_date.getDate() + 1);
                    }
                    year_str = sun_date.getFullYear().toString();
                    month_str = (sun_date.getMonth() + 1).toString();
                    date_str = sun_date.getDate().toString();
                    $(this).data('date', {
                        year_str: year_str,
                        month_str: month_str,
                        date_str: date_str
                    });
                    $($week_head[i + 1]).find('span').text(month_str + '/' + date_str);
                });
            } else {
                cur_date.type = 'day';
                $date_now.text(cur_date.year + '年' + switchMonthToEn(cur_date.month) + '月' + cur_date.day + '日');
            }
        }

        function switchMonthToEn(month) {
            var month_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
            return month_arr[parseInt(month)];
        }

        function switchLevelToCss(level) {
            var result = {};
            switch (parseInt(level)) {
                case 1:
                    result = {
                        "level": 1,
                        "schedule-leve": "schedule-level1",
                        "info-level": "info-1"
                    };
                    break;
                case 2:
                    result = {
                        "level": 2,
                        "schedule-leve": "schedule-level2",
                        "info-level": "info-2"
                    };
                    break;
                case 3:
                    result = {
                        "level": 3,
                        "schedule-leve": "schedule-level3",
                        "info-level": "info-3"
                    };
                    break;
                case 4:
                    result = {
                        "level": 4,
                        "schedule-leve": "schedule-level4",
                        "info-level": "info-4"
                    };
                    break;
            }
            return result;
        }

        function fillDateBox(data) {
            var $calendar = $('#calendar'),
                cur_date = $calendar.find('.date-now').data('data'),
                year_str = cur_date.year.toString(),
                month_str = (cur_date.month + 1).toString();
            fillCalendarHead('month');

            var days = getDateData(cur_date, 'days'),
                week_day_1th = getDateData(cur_date, 'week_1th'),
                used_box = week_day_1th + days;

            $calendar.find('.date-box').each(function (i) {
                var $this = $(this),
                    $date_content = $this.find('.date-content'),
                    $num_box = $this.find('.date-num'),
                    $schedule_box = $this.find('.date-schedule');
                $date_content.removeClass('schedule-level1 schedule-level2 schedule-level3 schedule-level4');
                $num_box.text('');
                $schedule_box.text('');

                var isSchedule = false,
                    date_str;
                if (i + 1 > week_day_1th && i < days + week_day_1th) {
                    date_str = (i - week_day_1th + 1).toString();
                    $this.data('date', {
                        year_str: year_str,
                        month_str: month_str,
                        date_str: date_str
                    });
                    $num_box.text(date_str);
                    isSchedule = data[year_str] &&
                        data[year_str][month_str] &&
                        data[year_str][month_str][date_str];
                    if (isSchedule) {
                        $this.data('schedule', data[year_str][month_str][date_str]);
                        var schedule_arr = $this.data('schedule'),
                            schedule_text = '';
                        for (var j = 0; j < schedule_arr.length; j++) {
                            var level = switchLevelToCss(schedule_arr[j]['level']);
                            $date_content.addClass(level['schedule-leve']);
                            schedule_text += schedule_arr[j]['theme'];
                            if ($date_content.data('level') && $date_content.data('level').level < level.level) {
                                $date_content.append('<div class="function-info ' + (level['info-level']) + '">2</div>');
                                $date_content.data('level', level);
                            }
                        }
                        $schedule_box.text(schedule_text);
                    }
                }
                if (used_box < 35 && i > 34) {
                    $this.hide();
                } else if (used_box > 35 && i > 34) {
                    $this.show();
                }
            })
        }

        function fillWeekBox(data) {
            fillCalendarHead('week');
            $('.week-tab-content>.week-tab-col').each(function () {
                addScheduleLabel($(this), data);
            });
        }

        function fillDayBox(data) {
            fillCalendarHead('day');
            $('.day-tab-content>.day-tab-col').each(function () {
                var $this = $(this);
                var cur_date = $('#calendar').find('.date-now').data('data'),
                    year_str = cur_date.year.toString(),
                    month_str = (cur_date.month + 1).toString(),
                    day_str = cur_date.day.toString();
                $this.data('date', {
                    year_str: year_str,
                    month_str: month_str,
                    date_str: day_str
                });
                addScheduleLabel($this, data);
            });
        }

        function addScheduleLabel($ele, data) {
            var date = $ele.data('date'),
                isSchedule = data[date.year_str] &&
                    data[date.year_str][date.month_str] &&
                    data[date.year_str][date.month_str][date.date_str];
            $ele.find('.week-schedule').remove();
            if (isSchedule) {
                $ele.data('schedule', data[date.year_str][date.month_str][date.date_str]);
                var schedule_html = '',
                    schedule_arr = $ele.data('schedule'),
                    start_time, end_time, top, height;
                for (var j = 0; j < schedule_arr.length; j++) {
                    if (schedule_arr[j]['allDay'] == 0) {
                        start_time = schedule_arr[j]['start'].split(':');
                        end_time = schedule_arr[j]['end'].split(':');
                        start_time[0] = Number(start_time[0]);
                        if (start_time[1] == '30') {
                            start_time[0] = Number(start_time[0]) + 0.5;
                        } else {
                            start_time[0] = Number(start_time[0]);
                        }
                        top = (start_time[0] + 1) * 4 + '%';
                        if (end_time[1] == '30') {
                            end_time[0] = Number(end_time[0]) + 0.5;
                        } else {
                            end_time[0] = Number(end_time[0]);
                        }
                        height = (Math.abs(end_time[0] - start_time[0])) * 4 + '%';

                        schedule_html += '<div class="week-schedule ' + switchLevelToCss(schedule_arr[j]['level']) + '" style="top:' + top + ';min-height:' + height + ';">' +
                            '<div>' + schedule_arr[j]['start'] + '-' + schedule_arr[j]['end'] + '</div>'
                            + schedule_arr[j]['theme'] + '</div>';
                    } else {
                        schedule_html += '<div class="week-schedule ' + switchLevelToCss(schedule_arr[j]['level']) + '" style="top: 0 ;min-height: 4%">' +
                            '<div></div>'
                            + schedule_arr[j]['theme'] + '</div>';
                    }
                }
                $ele.append(schedule_html);
            }
        }

        $('#calendar_day').click(function () {
            $('.calendar-btn-active').removeClass('calendar-btn-active');
            $(this).addClass('calendar-btn-active');
            $('#calendar_month_tab, #calendar_week_tab').hide();
            fillDayBox(schedule_data);
            $('#calendar_day_tab').show();
        });
        $('#calendar_week').click(function () {
            $('.calendar-btn-active').removeClass('calendar-btn-active');
            $(this).addClass('calendar-btn-active');
            $('#calendar_month_tab, #calendar_day_tab').hide();
            fillWeekBox(schedule_data);
            $('#calendar_week_tab').show();
        });
        $('#calendar_month').click(function () {
            $('.calendar-btn-active').removeClass('calendar-btn-active');
            $(this).addClass('calendar-btn-active');
            $('#calendar_day_tab, #calendar_week_tab').hide();
            fillDateBox(schedule_data);
            $('#calendar_month_tab').show();
        });
        $('.btn-right').click(function () {
            var cur_date = $('#calendar').find('.date-now').data('data'),
                date = new Date(cur_date.year, cur_date.month, cur_date.day);
            if (cur_date.type == 'month') {
                if (cur_date.month == 11) {
                    cur_date.year = cur_date.year + 1;
                    cur_date.month = 0;
                } else {
                    cur_date.month = cur_date.month + 1;
                }
                cur_date.day = 1;
                fillDateBox(schedule_data);
            } else if (cur_date.type == 'week') {
                date.setDate(date.getDate() + 7);
                cur_date.year = date.getFullYear();
                cur_date.month = date.getMonth();
                cur_date.day = date.getDate();
                fillWeekBox(schedule_data);
            } else {
                date.setDate(date.getDate() + 1);
                cur_date.year = date.getFullYear();
                cur_date.month = date.getMonth();
                cur_date.day = date.getDate();
                fillDayBox(schedule_data);
            }
        });
        $('.btn-left').click(function () {
            var cur_date = $('#calendar').find('.date-now').data('data'),
                date = new Date(cur_date.year, cur_date.month, cur_date.day);
            if (cur_date.type == 'month') {
                if (cur_date.month == 0) {
                    cur_date.year = cur_date.year - 1;
                    cur_date.month = 11;
                } else {
                    cur_date.month = cur_date.month - 1;
                }
                cur_date.day = 1;
                fillDateBox(schedule_data);
            } else if (cur_date.type == 'week') {
                date.setDate(date.getDate() - 7);
                cur_date.year = date.getFullYear();
                cur_date.month = date.getMonth();
                cur_date.day = date.getDate();
                fillWeekBox(schedule_data);
            } else {
                date.setDate(date.getDate() - 1);
                cur_date.year = date.getFullYear();
                cur_date.month = date.getMonth();
                cur_date.day = date.getDate();
                fillDayBox(schedule_data);
            }
        });
        $('#calendar').on('click', '.date-box, .week-tab-col, .day-tab-col', function () {
            var $this = $(this),
                $modal = $('#modal'),
                cur_date = $this.data('date');
            // 保存当前的日期类型
            cur_date.type = $('#calendar').find('.date-now').data('data').type;
            if ($this.attr('class') == 'date-box' && $this.find('.date-num').text() == '') {
                return false;
            }
            $modal.find('.modal-header>.modal-date').data('date', cur_date).text('日期：' + cur_date.year_str + '年' + cur_date.month_str + '月' + cur_date.date_str + '日');
            if ($this.data('schedule')) {
                var select_option = '', $option, schedule_arr = $this.data('schedule');
                var $select = $modal.find('#schedule_list');
                for (var i = 0, len = schedule_arr.length; i < len; i++) {
                    select_option = '<option value="' + i + '">' + schedule_arr[i].theme + '</option>';
                    $option = $(select_option);
                    $option.data('schedule', schedule_arr[i]);
                    $select.append($option);
                }
                $select.val('0').trigger('change');
            }
            $modal.show();
        });
        $('#schedule_list').change(function () {
            var $cur_option = $('#schedule_list').find('option:selected');
            if ($cur_option.data('schedule')) {
                fillModal(false, $cur_option.data('schedule'))
            } else {
                fillModal(true);
            }
        });
        $('#schedule_type').change(function () {
            if ($(this).val() == 0) {
                $('#time_slot').show();
            } else {
                $('#time_slot').hide();
            }
        });
        $('#modal_save').click(function () {
            var $modal_body = $('.modal-body'),
                start_time = parseInt($modal_body.find('#start_time').val()),
                start_minute = parseInt($modal_body.find('#start_minute').val()),
                end_time = parseInt($modal_body.find('#end_time').val()),
                end_minute = parseInt($modal_body.find('#end_minute').val());
            if (start_time > end_time || (start_time == end_time && start_minute >= end_minute)) {
                alert('结束时间必须大于开始时间！');
                return false;
            }
            var schedule_obj = {
                theme: $modal_body.find('.modal-theme>input').val(),
                content: $modal_body.find('.modal-detail>textarea').val(),
                level: $modal_body.find('#important').val(),
                allDay: $modal_body.find('#schedule_type').val()
            };
            if (schedule_obj.theme == '') {
                alert('必须输入任务主题！');
                return false;
            }
            if (schedule_obj.allDay == 0) {
                schedule_obj.start = start_time + (start_minute == 0 ? ':00' : ':30');
                schedule_obj.end = end_time + (end_minute == 0 ? ':00' : ':30');
            }
            var $schedule_list = $modal_body.find('#schedule_list');
            if ($schedule_list.val() == -1) {
                // 说明是新建日程
                var $option = $('<option>' + schedule_obj.theme + '</option>');
                $option.data('schedule', schedule_obj);
                $schedule_list.append($option);
            } else {
                $schedule_list.find('option:selected').data('schedule', schedule_obj);
            }
            //fillModal(true);
            alert('保存成功！');
        });
        $('#modal_delete').click(function () {
            var $schedule_list = $('.modal-body').find('#schedule_list'),
                $cur_option = $schedule_list.find('option:selected');
            if ($cur_option.val() != -1) {
                $cur_option.remove();
                $schedule_list.val(-1);
                fillModal(true);
                alert('已删除!');
            }
        });
        $('.modal-close').click(function () {
            var schedule_arr = [];
            $('#schedule_list').find('option').each(function (i) {
                if (i > 0) {
                    var $this = $(this);
                    schedule_arr.push($this.data('schedule'));
                    $this.remove();
                }
            });
            var $modal = $('#modal'),
                cur_date = $modal.find('.modal-header>.modal-date').data('date');
            if (schedule_arr.length == 0) {
                schedule_data[cur_date.year_str] && schedule_data[cur_date.year_str][cur_date.month_str] && delete schedule_data[cur_date.year_str][cur_date.month_str][cur_date.date_str];
            } else {
                schedule_data[cur_date.year_str] || (schedule_data[cur_date.year_str] = {});
                schedule_data[cur_date.year_str][cur_date.month_str] || (schedule_data[cur_date.year_str][cur_date.month_str] = {});
                schedule_data[cur_date.year_str][cur_date.month_str][cur_date.date_str] = schedule_arr;
            }
            if (cur_date.type == 'month') {
                fillDateBox(schedule_data);
            } else if (cur_date.type == 'week') {
                fillWeekBox(schedule_data);
            } else {
                fillDayBox(schedule_data);
            }
            $modal.hide();
            fillModal(true);

            $modal.find('#schedule_list').empty().append('<option value="-1">新建日程</option>');
        });

        function fillModal(isClear, data) {
            var $modal = $('#modal');
            if (isClear == true) {
                $modal.find('input, textarea').val('');
                $modal.find('#start_time, #start_minute, #end_time, #end_minute').val(0);
            } else {
                $modal.find('#schedule_type').val(parseInt(data['allDay'])).trigger('change');
                if (data['allDay'] == 0) {
                    var start_time = data['start'].split(':'),
                        end_time = data['end'].split(':');
                    $modal.find('#start_time').val(start_time[0]);
                    $modal.find('#start_minute').val(start_time[1] == '00' ? 0 : 1);
                    $modal.find('#end_time').val(end_time[0]);
                    $modal.find('#end_minute').val(end_time[1] == '00' ? 0 : 1);
                }
                $modal.find('#important').val(parseInt(data['level']));
                $modal.find('.modal-body>.modal-theme>input').val(data['theme']);
                $modal.find('.modal-body>.modal-detail>textarea').val(data['content']);
            }
        }

        function initWeekBox() {
            var time_html = '', week_tab_html = '';
            for (var i = 0; i < 24; i++) {
                time_html += '<div class="time-content"></div><div class="time-bro"></div>';
            }
            for (var j = 0; j < 7; j++) {
                week_tab_html += '<div class="week-tab-col"><div class="time-all-day"></div>' + time_html + '</div>';
            }
            time_html = '<div><div class="time-all-day"></div>' + time_html + '</div>';
            week_tab_html = time_html + week_tab_html;
            var $week_tab_content = $('#week_tab_content');
            $week_tab_content.append(week_tab_html).find('div:first').find('.time-content').each(function (i) {
                $(this).text(i > 9 ? i + ':00' : '0' + i + ':00');
            });
            $week_tab_content.find('.time-all-day')[0].innerHTML = 'all day';
        }

        initWeekBox();

        function initDayBox() {
            var day_html = '', day_tab_html = '';
            for (var i = 0; i < 24; i++) {
                day_html += '<div class="time-content"></div><div class="time-bro"></div>';
            }
            day_tab_html = '<div><div class="time-all-day"></div>' + day_html + '</div>' +
                '<div class="day-tab-col"><div class="time-all-day"></div>' + day_html + '</div>';
            var $day_tab_content = $('#day_tab_content');
            $day_tab_content.append(day_tab_html).find('div:first').find('.time-content').each(function (i) {
                $(this).text(i > 9 ? i + ':00' : '0' + i + ':00');
            });
            $day_tab_content.find('.time-all-day')[0].innerHTML = 'all day';
        }

        initDayBox();
    });
});