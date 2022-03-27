// debugは削除予定
let debug_mode = false;

// 現在のステップ
let current_step = 1;
// 現在のカラーステップ
let current_color_step = 1;
// 一番進んだステップ
let max_progress_step = 1;
// ステップごとのクリアフラグ（必須項目を埋めたか）
let clear_flug_arr_of_step = [false, false, false, false, false, false, false];
// カラー選択のクリア数
let clear_flug_arr_of_color_step = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

// STEP6（刺繍）の選択項目管理
// 右手:タイプ、文字、色
let clear_flug_arr_of_step_6_right = [false, false, false];
// 左手:タイプ、文字、色
let clear_flug_arr_of_step_6_left = [false, false, false];
// 初回アクセス化
let is_first_access_step_6 = true;

const STEP_MAX_COUNT = 7;
const COLOR_STEP_MAX_COUNT = 16;

$(function() {
    ////////////////////////
    // 初期処理
    ////////////////////////

    // selectorは表示しない（最初からcssにdisplay:noneを指定すると、横スクロールに問題があったため、ここで制御する）
    // $("#glove_parts_selector").hide();
    display_none_control_panel_without_step(1);

    // 初回モーダル表示
    $('.js-modal').fadeIn();
    $('.js-modal-close').on('click',function(){
        $('.js-modal').fadeOut();
        return false;
    });

    ////////////////////////
    // 検証モード 削除予定
    ////////////////////////
    $("#debug_mode").click(function () {
        if(debug_mode){
            debug_mode = false;
            $("#debug_mode").text("進むボタン有効モード");
        }else{
            debug_mode = true;
            set_active_next_step_button('');
            $("#next_step_button").prop("disabled", false);
            $("#debug_mode").text("有効モード中");
        }
    });

    ////////////////////////
    // リアルタイム監視
    ////////////////////////

    $(document).ready(function () {
        // STEP1
        // 選択肢を一度でも押したら次のステップボタンを活性化（ラジオボタンのため）
        $(".control-panel-select-item-label-step1").click(function () {
            clear_flug_arr_of_step[0] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(2);

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-label-step1").css('background-color','#dddddd');
            $(".control-panel-select-item-label-step1").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');
        });

        // STEP2
        $(".control-panel-select-item-label-step2").click(function () {

            // 2-10のみ特殊（手袋自体の色を白に変える必要あり）
            $(`#control_panel_step_2_10_select_list`).children(".control-panel-select-item-label-step2").click(function(){
                if($(this).attr('id') == 'white_glove_color_label'){
                    // シリコーンの色が白に選択されたときのみ、手袋を白に変更する
                    $(".glove-simulation").css('background-image', 'url(img/grove-white.png)');
                } else {
                    $(".glove-simulation").css('background-image', 'url(img/grove.png)');
                }
            });

            // labelから選択されたカラーを抽出
            let selected_color = $(this).attr('for').replace(`panel_select_color_${current_color_step}_`,'');

            // current_color_stepを元にclear_flug_arr_of_color_stepを更新（ラジオボタンなので即有効にする）
            clear_flug_arr_of_color_step[current_color_step-1] = true;

            // color- で始まるclassすべて削除
            $(`#parts_selector_${current_color_step}`).removeClass (function (index, css) {
                return (css.match (/\bcolor-\S+/g) || []).join(' ');
            });
            // 選択した色をパーツセレクターの背景にセット
            $(`#parts_selector_${current_color_step}`).addClass('color-'+selected_color);
            $(`#parts_selector_${current_color_step}`).addClass('clear');

            // 新しい選択肢が選択されたら、そのカラーステップ内の選択肢全体を非活性化する
            $(`#control_panel_step_2_${current_color_step}_select_list`).children(".control-panel-select-item-label-step2").css('background-color','#dddddd');
            $(`#control_panel_step_2_${current_color_step}_select_list`).children(".control-panel-select-item-label-step2").css('color','#000');
            // そして、選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // シミュレーターに反映
            set_simulator_by_current_color_step(current_color_step, selected_color);

            // すべてtrueになっていたら
            if ( !clear_flug_arr_of_color_step.includes(false) ) {
                clear_flug_arr_of_step[1] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(3);
            }
        });

        // STEP3
        $(".control-panel-select-item-label-step3").click(function () {
            clear_flug_arr_of_step[2] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(4);

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-label-step3").css('background-color','#dddddd');
            $(".control-panel-select-item-label-step3").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');
        });

        // STEP4
        $(".control-panel-select-item-label-step4").click(function () {
            clear_flug_arr_of_step[3] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(5);

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-label-step4").css('background-color','#dddddd');
            $(".control-panel-select-item-label-step4").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');
        });

        // STEP5
        $(".control-panel-select-item-label-step5").click(function () {
            clear_flug_arr_of_step[4] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(6);

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-label-step5").css('background-color','#dddddd');
            $(".control-panel-select-item-label-step5").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');
        });

        // STEP6-右
        // トグルボタン
        $('#step_6_right_switch').on('click', function() {
            if ( $(this).prop('checked') == true ) {
                $('#control_panel_step_6_on_name_type_right').show();
                $('#control_panel_step_6_on_name_text_right').show();
                $('#control_panel_step_6_on_name_color_right').show();

                $(".panel-select-on-name-type-right").prop("disabled", false);
                $(".panel-select-on-name-color-right").prop("disabled", false);

                // こっちは判定タイミングが合わなかった
                // if ($("input[class='panel-select-on-name-type-right']:checked").val() === undefined) {
                if (!clear_flug_arr_of_step_6_right[0]) {
                    // 刺繍タイプが選択される前（disabled=true）は、text も disabled を true （無効）にする
                    $("#panel_select_on_name_text_right").prop("disabled", true);
                }else{
                    $("#panel_select_on_name_text_right").prop("disabled", false);
                }

                // 右手が完了している、かつ、（左手も完了、もしくは、左手はなし）の場合は、次へボタン活性化
                if($.inArray(false, clear_flug_arr_of_step_6_right) == -1 &&
                ($.inArray(false, clear_flug_arr_of_step_6_left) == -1 ||
                    $('#step_6_left_switch').prop('checked') == false)
                ){
                    clear_flug_arr_of_step[5] = true;
                    set_active_next_step_button(7);
                }else{
                    // そうじゃない場合は、次へボタン非活性
                    clear_flug_arr_of_step[5] = false;
                    set_disable_next_step_button(7);
                }
            } else {
                // 右手がなしの場合
                // 左手がなし、もしくは、完了の状態の場合、次へのボタンを活性化
                if($('#step_6_left_switch').prop('checked') == false || $.inArray(false, clear_flug_arr_of_step_6_left) == -1){
                    clear_flug_arr_of_step[5] = true;
                    set_active_next_step_button(7);
                }
                $('#control_panel_step_6_on_name_type_right').hide();
                $('#control_panel_step_6_on_name_text_right').hide();
                $('#control_panel_step_6_on_name_color_right').hide();

                $(".panel-select-on-name-type-right").prop("disabled", true);
                $("#panel_select_on_name_text_right").prop("disabled", true);
                $(".panel-select-on-name-color-right").prop("disabled", true);
            }
        });
        // 刺繍タイプ
        $(".control-panel-select-item-on-name-type-right-label-step6").click(function () {
            clear_flug_arr_of_step_6_right[0] = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-on-name-type-right-label-step6").css('background-color','#dddddd');
            $(".control-panel-select-item-on-name-type-right-label-step6").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 選択された刺繍タイプの条件をテキストエリアのplaceholderに表示
            $("#panel_select_on_name_text_right").prop("placeholder", $.trim($(this).text()));
            // テキストエリアを活性化
            $("#panel_select_on_name_text_right").prop("disabled", false);

            // 選択されている刺繍タイプに沿った処理をするため
            let panel_select_on_name_type_id = $(this).attr('for');
            let text_obj = $("#panel_select_on_name_text_right");
            check_on_name_text(panel_select_on_name_type_id, text_obj, true);

            // 右手が完了している、かつ、（左手も完了、もしくは、左手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_right) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_left) == -1 ||
                $('#step_6_left_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            }
        });
        // 刺繍文字
        $("#panel_select_on_name_text_right").on('input', function () {
            clear_flug_arr_of_step_6_right[1] = true;

            // 選択されている刺繍タイプに沿った処理をするため
            let panel_select_on_name_type_id = $("input[class='panel-select-on-name-type-right']:checked").attr('id');

            check_on_name_text(panel_select_on_name_type_id, $(this), true);

            // 右手が完了している、かつ、（左手も完了、もしくは、左手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_right) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_left) == -1 ||
                $('#step_6_left_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            } else {
                clear_flug_arr_of_step[5] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button(7);
            }
        });
        // 刺繍色
        $(".control-panel-select-item-on-name-color-right-label-step6").click(function () {
            clear_flug_arr_of_step_6_right[2] = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-on-name-color-right-label-step6").css('background-color','#dddddd');
            $(".control-panel-select-item-on-name-color-right-label-step6").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 右手が完了している、かつ、（左手も完了、もしくは、左手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_right) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_left) == -1 ||
                $('#step_6_left_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            }
        });

        // STEP6-左手
        // トグルボタン
        $('#step_6_left_switch').on('click', function() {
            // 左手が完了している、かつ、（右手も完了、もしくは、右手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_left) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_right) == -1 ||
                $('#step_6_right_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                set_active_next_step_button(7);
            }else{
                // そうじゃない場合は、次へボタン非活性
                clear_flug_arr_of_step[5] = false;
                set_disable_next_step_button(7);
            }

            if ( $(this).prop('checked') == true ) {
                $('#control_panel_step_6_on_name_type_left').show();
                $('#control_panel_step_6_on_name_text_left').show();
                $('#control_panel_step_6_on_name_color_left').show();

                $(".panel-select-on-name-type-left").prop("disabled", false);
                $(".panel-select-on-name-color-left").prop("disabled", false);

                // こっちは判定タイミングが合わなかった
                // if ($("input[class='panel-select-on-name-type-left']:checked").val() === undefined) {
                if (!clear_flug_arr_of_step_6_left[0]) {
                    // 刺繍タイプが選択される前は、text も disabled を true （無効）にする
                    $("#panel_select_on_name_text_left").prop("disabled", true);
                }else{
                    $("#panel_select_on_name_text_left").prop("disabled", false);
                }
            } else {
                // 左手がなしの場合
                // 右手がなし、もしくは、完了の状態の場合、次へのボタンを活性化
                if($('#step_6_right_switch').prop('checked') == false || $.inArray(false, clear_flug_arr_of_step_6_right) == -1){
                    clear_flug_arr_of_step[5] = true;
                    set_active_next_step_button(7);
                }
                $('#control_panel_step_6_on_name_type_left').hide();
                $('#control_panel_step_6_on_name_text_left').hide();
                $('#control_panel_step_6_on_name_color_left').hide();

                $(".panel-select-on-name-type-left").prop("disabled", true);
                $("#panel_select_on_name_text_left").prop("disabled", true);
                $(".panel-select-on-name-color-left").prop("disabled", true);
            }
        });
        // 刺繍タイプ
        $(".control-panel-select-item-on-name-type-left-label-step6").click(function () {
            clear_flug_arr_of_step_6_left[0] = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-on-name-type-left-label-step6").css('background-color','#dddddd');
            $(".control-panel-select-item-on-name-type-left-label-step6").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 選択された刺繍タイプの条件をテキストエリアのplaceholderに表示
            $("#panel_select_on_name_text_left").prop("placeholder", $.trim($(this).text()));
            // テキストエリアを活性化
            $("#panel_select_on_name_text_left").prop("disabled", false);

            // 選択されている刺繍タイプに沿った処理をするため
            let panel_select_on_name_type_id = $(this).attr('for');
            let text_obj = $("#panel_select_on_name_text_left");
            check_on_name_text(panel_select_on_name_type_id, text_obj, false);


            // 左手が完了している、かつ、（右手も完了、もしくは、右手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_left) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_right) == -1 ||
                $('#step_6_right_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            }
        });
        // 刺繍文字
        $("#panel_select_on_name_text_left").on('input', function () {
            clear_flug_arr_of_step_6_left[1] = true;

            // 選択されている刺繍タイプに沿った処理をするため
            let panel_select_on_name_type_id = $("input[class='panel-select-on-name-type-left']:checked").attr('id');

            check_on_name_text(panel_select_on_name_type_id, $(this), false);

            // 右手が完了している、かつ、（左手も完了、もしくは、左手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_left) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_left) == -1 ||
                $('#step_6_left_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            } else {
                clear_flug_arr_of_step[5] = false;
                // 次のステップボタン（非活性化）
                set_disable_next_step_button(7);
            }
        });
        // 刺繍色
        $(".control-panel-select-item-on-name-color-left-label-step6").click(function () {
            clear_flug_arr_of_step_6_left[2] = true;

            // 一旦選択肢全体を非活性化
            $(".control-panel-select-item-on-name-color-left-label-step6").css('background-color','#dddddd');
            $(".control-panel-select-item-on-name-color-left-label-step6").css('color','#000');

            // 選択されたものだけを活性化
            $(this).css('background-color','#012F3D');
            $(this).css('color','#FFF');

            // 左手が完了している、かつ、（右手も完了、もしくは、右手はなし）の場合は、次へボタン活性化
            if($.inArray(false, clear_flug_arr_of_step_6_left) == -1 &&
            ($.inArray(false, clear_flug_arr_of_step_6_right) == -1 ||
                $('#step_6_right_switch').prop('checked') == false)
            ){
                clear_flug_arr_of_step[5] = true;
                // 次のステップボタン（活性）
                set_active_next_step_button(7);
            }
        });

        // STEP7
        // すべての選択肢を押したら完了ボタンを活性化（チェックボックスのため）
        $("input[name='dummy_name_7']").click(function () {
            let cnt_checked = $('#control_panel_step_7_select_list input:checkbox:checked').length;

            // 同意事項4つを想定
            if (cnt_checked == 4) {
                clear_flug_arr_of_step[6] = true;
                // 完了ボタン（活性）
                set_active_submit_button();
            } else {
                clear_flug_arr_of_step[6] = false;
                // 完了ボタン（非活性）
                set_disable_submit_button();
            }
        });
    });

    ////////////////////////
    // 前に戻るボタンが押されたら
    ////////////////////////
    $('#back_step_button').on('click', function() {
        // current_step が１より大きい場合のみ実行
        if(current_step > 1){
            // 前のSTEPに現在ステップにする
            $(`#progressbar_step_${current_step}`).removeClass('current');
            $(`#progressbar_step_${current_step-1}`).addClass('current');

            // current_stepを+1する
            current_step-=1;

            // +1されたcurrent_stepに該当する画面を表示
            control_view_by_selected_step(current_step);
        }
    });


    ////////////////////////
    // 次のステップが押されたら
    ////////////////////////

    $('#next_step_button').on('click', function() {

        if(current_step < STEP_MAX_COUNT){
            // 押されたSTEPをactiveにする
            $(`#progressbar_step_${current_step}`).addClass('active');

            // 次のSTEPを現在ステップにする
            $(`#progressbar_step_${current_step}`).removeClass('current');
            $(`#progressbar_step_${current_step+1}`).addClass('current');

            // current_stepを+1する
            current_step+=1;

            // +1されたcurrent_stepに該当する画面を表示
            control_view_by_selected_step(current_step);

            // +1されたcurrent_step が max_progress_step より大きい場合、max_progress_step(一番進んだステップ)を塗り替える
            if(current_step > max_progress_step){
                max_progress_step = current_step;
            }
        }else{
            // TODO 完了を押した場合
            if ($.inArray(false, clear_flug_arr_of_step) != -1) {
                alert(`STEP${$.inArray(false, clear_flug_arr_of_step)+1}がまだ完了しておりません。`);
            } else {
                // すべてクリアした場合
                alert('準備中');
                // buttonをtype=submitにする
                $('#next_step_button').attr('type', 'submit');
            }
        }
    });


    ////////////////////////
    // 各STEPが押されたら
    ////////////////////////

    $('#progressbar').children('li').on('click', function() {
        let selected_step_num = $(this).index()+1;

        // 選択したステップが max_progress_step の範囲内、かつ、current_stepでなければ表示する
        if( selected_step_num <= max_progress_step && selected_step_num != current_step ){
            // alert(`STEP${selected_step_num}を表示します。`);

            // 1. current_stepから現在ステップを削除
            $(`#progressbar_step_${current_step}`).removeClass('current');

            // 2. current_step を 選択された stepに更新
            current_step = selected_step_num;
            control_view_by_selected_step(selected_step_num);

            // 3. 更新されたcurrent_stepを現在ステップにセット
            $(`#progressbar_step_${current_step}`).addClass('current');

        }else if( selected_step_num == current_step ){
            // alert(`STEP${selected_step_num}は既に表示されております。`);

        }else{
            // alert(`まだSTEP${selected_step_num-1}まで完了しておりません。`);
            alert(`先にSTEP${current_step}を完了して下さい。`);
        }
    });


    ////////////////////////
    // カラーSTEPが押されたら
    ////////////////////////
    $(".parts-selector-img").on('click', function() {
        // 選択されたパーツ画像からカラーステップを抽出
        current_color_step = Number( $(this).attr('id').replace('parts_selector_','') );
        // カラーステップに応じてビューを制御
        control_view_color_select(current_color_step);
    });


    ////////////////////////
    // 関数
    ////////////////////////

    /**
     * 選択された step によって、ビューを制御する
     *
     */
    function control_view_by_selected_step(step){

        display_none_control_panel_without_step(step);
        display_none_parts_selector_without_step3(step);

        // debugは削除予定
        if(clear_flug_arr_of_step[step-1] || debug_mode){
            //クリアされたステップだった場合
            // 次のステップボタン（活性化）
            set_active_next_step_button(step+1);
        }else{
            // 次のステップボタン（非活性）
            set_disable_next_step_button(step+1);
        }

        switch (step) {
            case 1:
                $("#control_panel_header").children('b').text('STEP1. 掌部');
                // STEP1のみ前に戻るを押せなくするため
                set_disable_back_step_button();
                break;
            case 2:
                $("#control_panel_header").children('b').text('STEP2. カラー');
                set_active_back_step_button();
                break;
            case 3:
                $("#control_panel_header").children('b').text('STEP3. サイズ');
                set_active_back_step_button();
                break;
            case 4:
                $("#control_panel_header").children('b').text('STEP4. 指の長さ');
                set_active_back_step_button();
                break;
            case 5:
                $("#control_panel_header").children('b').text('STEP5. 当て革の型');
                set_active_back_step_button();
                break;
            case 6:
                $("#control_panel_header").children('b').text('STEP6. 手首ベルト部の刺繍');
                set_active_back_step_button();

                // 1. 順序守る必要あり
                if(clear_flug_arr_of_step[step-1]){
                    // クリアされたステップだった場合
                    // 完了ボタン（活性化）
                    set_active_next_step_button(step-1);
                }else{
                    // 完了ボタン（非活性）
                    set_disable_next_step_button(step-1);
                }

                // 2. 順序守る必要あり
                // デフォルトは設定なしなので、初回アクセス時は、前に進むボタンを有効化
                if(is_first_access_step_6){
                    set_active_next_step_button(step+1);
                }
                // 初回アクセスフラグをfalseにする
                is_first_access_step_6 = false;
                break;
            case 7:
                $("#control_panel_header").children('b').text('STEP7. 注意事項');
                set_active_back_step_button();

                if(clear_flug_arr_of_step[step-1]){
                    // クリアされたステップだった場合
                    // 完了ボタン（活性化）
                    set_active_submit_button();
                }else{
                    // 完了ボタン（非活性）
                    set_disable_submit_button();
                }
                break;
            default:
                break;
        }
    }

    /**
     * 該当step以外のcontrol_panelを非表示にする
     *
     */
    function display_none_control_panel_without_step(step){
        for(var i=1; i<=STEP_MAX_COUNT; i++){
            if(step === i){
                $(`#control_panel_step_${i}`).show();
            }else{
                $(`#control_panel_step_${i}`).hide();
            }
        }
    }

    /**
     * current_stepが2（カラー選択）以外の場合、parts_selectorを非表示にする
     *
     */
    function display_none_parts_selector_without_step3(step){
        if(step === 2){
            $("#glove_parts_selector").show();
        }else{
            $("#glove_parts_selector").hide();
        }
    }

    /**
     * 次のステップボタンを活性化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_active_next_step_button(step){
        $("#next_step_button").prop("disabled", false);

        // $("#next_step_button").text(`STEP${step}に進む`);
        $("#next_step_button").text("次に進む");
        $("#next_step_button").css({
            'background-color':'#eb6100',
            'padding-left':'9px',
            'padding-right':'9px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#f56500");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#eb6100");
        });
    }

    /**
     * 前に戻るボタンを活性化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_active_back_step_button(){
        $("#back_step_button").prop("disabled", false);

        $("#back_step_button").css({
            'background-color':'#eb6100',
            'padding-left':'9px',
            'padding-right':'9px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#f56500");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#eb6100");
        });
    }
    /**
     * 次のステップボタンを無効化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_disable_next_step_button(step){
        // debugは削除予定
        if(!debug_mode){
            $("#next_step_button").prop("disabled", true);

            $("#next_step_button").text("次に進む");
            // $("#next_step_button").text(`STEP${step}に進む`);
            $("#next_step_button").css({
                'background-color':'#d8d8d8',
                'padding-left':'10px',
                'padding-right':'10px',
            });
            $("#next_step_button").hover(function() {
                // カーソルが当たった時の処理
                $(this).css("background-color", "#d8d8d8");
            }, function() {
                // カーソルが離れた時の処理
                $(this).css("background-color", "#d8d8d8");
            });
        }
    }

    /**
     * 前のステップボタンを無効化
     *
     * @param step ボタンに表示するステップ番号（next step)
     */
    function set_disable_back_step_button(){
        $("#back_step_button").prop("disabled", true);

        $("#back_step_button").css({
            'background-color':'#d8d8d8',
            'padding-left':'10px',
            'padding-right':'10px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#d8d8d8");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#d8d8d8");
        });
    }

    /**
     * 完了ボタンを活性化
     *
     */
    function set_active_submit_button(){
        $("#next_step_button").prop("disabled", false);

        // 完了ボタン（活性）
        $("#next_step_button").text('完了');
        $("#next_step_button").css({
            'background-color':'#ca1b1b',
            'padding-left':'20px',
            'padding-right':'20px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#da4343");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#ca1b1b");
        });
    }

    /**
     * 完了ボタンを無効化
     *
     */
    function set_disable_submit_button(){
        $("#next_step_button").prop("disabled", true);

        // 完了ボタン（活性）
        $("#next_step_button").text('完了');
        $("#next_step_button").css({
            'background-color':'#d8d8d8',
            'padding-left':'20px',
            'padding-right':'20px',
        });
        $("#next_step_button").hover(function() {
            // カーソルが当たった時の処理
            $(this).css("background-color", "#d8d8d8");
        }, function() {
            // カーソルが離れた時の処理
            $(this).css("background-color", "#d8d8d8");
        });
    }

    /**
     * 選択されたカラーステップに応じて画面を制御
     *
     * @param {*} color_step 表示すべきカラー選択のステップ
     */
    function control_view_color_select(color_step){

        // 該当のカラーステップ以外は非表示
        display_none_color_select_without_color_step(color_step);

        $(".parts-selector-img").removeClass('current');
        $(`#parts_selector_${color_step}`).addClass('current');

        switch (color_step) {
            case 1:
                $("#step_2_title").text('1. 掌部');
                $("#control_panel_explain_span").text('');
                break;
            case 2:
                $("#step_2_title").text('2. 甲部飾り1');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 3:
                $("#step_2_title").text('3. 甲部飾り2');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 4:
                $("#step_2_title").text('4. 甲部飾り3');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 5:
                $("#step_2_title").text('5. 甲部飾り4');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 6:
                $("#step_2_title").text('6. 甲部飾り5');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 7:
                $("#step_2_title").text('7. 甲部飾り6');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 8:
                $("#step_2_title").text('8. 甲部飾り7');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 9:
                $("#step_2_title").text('9. 指マチ');
                $("#control_panel_explain_span").text('');
                break;
            case 10:
                $("#step_2_title").text('10. シリコーン');
                $("#control_panel_explain_span").text('');
                break;
            case 11:
                $("#step_2_title").text('11. ニット1');
                $("#control_panel_explain_span").text('');
                break;
            case 12:
                $("#step_2_title").text('12. ニット2');
                $("#control_panel_explain_span").text('');
                break;
            case 13:
                $("#step_2_title").text('13. 手首ベルト部');
                $("#control_panel_explain_span").text('M.ネイビー、M.レッド、シルバー、ゴールドはマット調のエナメル素材になります。');
                break;
            case 14:
                $("#step_2_title").text('14. パイピング');
                $("#control_panel_explain_span").text('');
                break;
            case 15:
                $("#step_2_title").text('15. 袖ゴム');
                $("#control_panel_explain_span").text('ラインカラーはすべてゴールドになります。');
                break;
            case 16:
                $("#step_2_title").text('16. 甲飾りステッチ（縫い目）');
                $("#control_panel_explain_span").text('');
                break;
            default:
                $("#control_panel_explain_span").text('');
                break;
        }
    }

    /**
     * 該当カラーステップ以外は非表示にする
     *
     */
    function display_none_color_select_without_color_step(color_step){
        for(var i=1; i<=COLOR_STEP_MAX_COUNT; i++){
            if(color_step === i){
                $(`#control_panel_step_2_${i}_select_list`).show();
            }else{
                $(`#control_panel_step_2_${i}_select_list`).hide();
            }
        }
    }

    /**
     * カラーステップと色に合わせて、シミュレーターに反映
     *
     * @param {*} color_step カラーステップ（色を変える箇所）
     * @param {*} selected_color 選択された色
     */
    function set_simulator_by_current_color_step(color_step, selected_color){
        switch (color_step) {
            case 1:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-color-'+selected_color);

                $(`#glove_palm_parts_${color_step}`).removeClass();
                $(`#glove_palm_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 2:
            case 3:
            case 4:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 5:
            case 6:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-color-'+selected_color);

                $(`#glove_palm_parts_${color_step}`).removeClass();
                $(`#glove_palm_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 7:
            case 8:
            case 9:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 10:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-10-color-'+selected_color);
                break;
            case 11:
            case 12:
            case 13:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-color-'+selected_color);
                break;
            case 14:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-14-color-'+selected_color);
                break;
            case 15:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-15-color-'+selected_color);

                $(`#glove_palm_parts_${color_step}`).removeClass();
                $(`#glove_palm_parts_${color_step}`).addClass('parts-15-color-'+selected_color);
                break;
            case 16:
                $(`#glove_parts_${color_step}`).removeClass();
                $(`#glove_parts_${color_step}`).addClass('parts-16-color-'+selected_color);
                break;
            default:
                break;
        }
    }

    /**
     * 刺繍の内容をバリデーションチェックする
     *
     * @param {*} panel_select_on_name_type_id 選択された刺繍タイプのラジオボタンid
     * @param {*} text_obj チェック対象の文字
     * @param {*} is_right 右手か
     */
    function check_on_name_text(panel_select_on_name_type_id, text_obj, is_right){
        // 入力した文字列が 0文字の場合は、clearフラグを取り消す
        if (text_obj.val().length > 0 ) {
            if (is_right) {
                clear_flug_arr_of_step_6_right[1] = true;
            } else {
                clear_flug_arr_of_step_6_left[1] = true;
            }
        } else {
            clear_flug_arr_of_step[5] = false;
            if (is_right) {
                clear_flug_arr_of_step_6_right[1] = false;
            } else {
                clear_flug_arr_of_step_6_left[1] = false;
            }
        }

        // 文字数制限を超えたら、その分は即削除する
        switch (panel_select_on_name_type_id) {
            case "panel_select_on_name_type_right_1":
            case "panel_select_on_name_type_left_1":
                    if (text_obj.val().length > 5) {
                    text_obj.val(text_obj.val().slice(0, 5));
                }
                break;
            case "panel_select_on_name_type_right_2":
            case "panel_select_on_name_type_left_2":
                if (text_obj.val().length > 9) {
                    text_obj.val(text_obj.val().slice(0, 9));
                }
                break;
            case "panel_select_on_name_type_right_3":
            case "panel_select_on_name_type_left_3":
                if (text_obj.val().length > 9) {
                    text_obj.val(text_obj.val().slice(0, 9));
                }
                break;
            case "panel_select_on_name_type_right_4":
            case "panel_select_on_name_type_left_4":
                if (text_obj.val().length > 5) {
                    text_obj.val(text_obj.val().slice(0, 5));
                }
                break;
            case "panel_select_on_name_type_right_5":
            case "panel_select_on_name_type_left_5":
                if (text_obj.val().length > 5) {
                    text_obj.val(text_obj.val().slice(0, 5));
                }
                break;
            case "panel_select_on_name_type_right_6":
            case "panel_select_on_name_type_left_6":
                if (text_obj.val().length > 8) {
                    text_obj.val(text_obj.val().slice(0, 8));
                }
                break;
            case "panel_select_on_name_type_right_7":
            case "panel_select_on_name_type_left_7":
                if (text_obj.val().length > 8) {
                    text_obj.val(text_obj.val().slice(0, 8));
                }
                break;
            default:
                break;
        }
    }

});