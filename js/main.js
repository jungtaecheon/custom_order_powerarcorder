// 現在のステップ
let current_step = 1;
// 一番進んだステップ
let max_progress_step = 1;
// ステップごとのクリアフラグ（必須項目を埋めたか）
let clear_flug_arr_of_step = [false, false, false, false, false, false, false, false];

const original_color_parts_list = [10, 14, 15];
const STEP_MAX_COUNT = 8;

$(function() {
    ////////////////////////
    // リアルタイム監視
    ////////////////////////

    $(document).ready(function () {
        // STEP1
        $("input[name='dummy_name_1']").click(function () {
            clear_flug_arr_of_step[0] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(2);
        });

        // STEP2
        $("input[name='dummy_name_2']").click(function () {
            clear_flug_arr_of_step[1] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(3);
        });

        // STEP3
        $("input[name='dummy_name_3']").click(function () {
            clear_flug_arr_of_step[2] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(4);
        });

        // STEP4
        $("input[name='dummy_name_4']").click(function () {
            clear_flug_arr_of_step[3] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(5);
        });

        // STEP5
        $("input[name='dummy_name_5']").click(function () {
            clear_flug_arr_of_step[4] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(6);
        });

        // STEP6
        $("input[name='dummy_name_6']").click(function () {
            clear_flug_arr_of_step[5] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(7);
        });

        // STEP7
        $("input[name='dummy_name_7']").click(function () {
            clear_flug_arr_of_step[6] = true;
            // 次のステップボタン（活性）
            set_active_next_step_button(8);
        });

        // STEP8
        $("input[name='dummy_name_8']").click(function () {
            let cnt_checked = $('#control_panel_step_8 input:checkbox:checked').length;

            // TODO 同意が２つの場合はこんな感じ
            if (cnt_checked == 2) {
                clear_flug_arr_of_step[7] = true;
                // 完了ボタン（活性）
                set_active_submit_button();
            } else {
                clear_flug_arr_of_step[7] = false;
                // 完了ボタン（非活性）
                set_disable_submit_button();
            }
        });
    });


    ////////////////////////
    // 初期処理
    ////////////////////////

    // selectorは表示しない（最初からcssにdisplay:noneを指定すると、横スクロールに問題があったため、ここで制御する）
    $("#glove_parts_selector").hide();
    display_none_control_panel_without_step(1);


    ////////////////////////
    // 次のステップが押されたら
    ////////////////////////

    $('#next_step_button').on('click', function() {

        if(current_step < STEP_MAX_COUNT){
            // 押されたSTEPをactiveにする
            $(`#progressbar_step_${current_step}`).addClass('active');

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
            alert('開発中');
            // buttonをtype=submitにする
            $('#next_step_button').attr('type', 'submit');
        }
    });


    ////////////////////////
    // 各STEPが押されたら
    ////////////////////////

    $('#progressbar').children('li').on('click', function() {
        let selected_step_num = $(this).index()+1;

        // 選択したステップが max_progress_step の範囲内、かつ、current_stepでなければ表示する
        if( selected_step_num <= max_progress_step && selected_step_num != current_step ){
            alert(`STEP${selected_step_num}を表示します。`);

            // current_step を 選択された stepに更新
            current_step = selected_step_num;
            control_view_by_selected_step(selected_step_num);

        }else if( selected_step_num == current_step ){
            alert(`STEP${selected_step_num}は既に表示されております。`);

        }else{
            alert(`まだ、STEP${selected_step_num-1}が完了しておりません。`);
        }
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

        if(clear_flug_arr_of_step[step-1]){
            //クリアされたステップだった場合
            // 次のステップボタン（活性化）
            set_active_next_step_button(step+1);
        }else{
            // 次のステップボタン（非活性）
            set_disable_next_step_button(step+1);
        }

        switch (step) {
            case 1:
                $("#control_panel_header").children('b').text('STEP1. 拳部');
                break;
            case 2:
                $("#control_panel_header").children('b').text('STEP2. タイプ');
                break;
            case 3:
                $("#control_panel_header").children('b').text('STEP3. カラー選択');
                break;
            case 4:
                $("#control_panel_header").children('b').text('STEP4. サイズ');
                break;
            case 5:
                $("#control_panel_header").children('b').text('STEP5. 指の長さ');
                break;
            case 6:
                $("#control_panel_header").children('b').text('STEP6. 当て革の型');
                break;
            case 7:
                $("#control_panel_header").children('b').text('STEP7. オンネーム');
                break;
            case 8:
                $("#control_panel_header").children('b').text('STEP8. 注意事項');

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
     * current_stepが3以外の場合、parts_selectorを非表示にする
     *
     */
    function display_none_parts_selector_without_step3(step){
        if(step === 3){
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

        $("#next_step_button").text(`STEP${step}に進む`);
        $("#next_step_button").css({
            'background-color':'#eb6100',
            'padding-left':'10px',
            'padding-right':'10px',
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
        $("#next_step_button").prop("disabled", true);

        $("#next_step_button").text(`STEP${step}に進む`);
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
});