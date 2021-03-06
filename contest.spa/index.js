function doAjax() {
    $.ajax(
        {
            type: 'GET',
            url: 'http://localhost:5000/current',
            success: function (data) {
                $('#question').text(data.question);
                var list = $('<ul></ul>');
                $('#answers').empty();
                $.each(data.answers, function (i) {
                    var li = $('<li></li>')
                        .text(data.answers[i].answer)
                        .appendTo(list);
					var span = $('<span></span>');
					span.text(data.answers[i].points);
					span.appendTo(li);
                });
                $('#answers').append(list);
            }
        }
    );
    $.ajax(
        {
            type: 'GET',
            url: 'http://localhost:5000/score',
            success: function (data) {
                $('#score').text(data.score);
            }
        }
    );
    $.ajax(
        {
            type: 'GET',
            url: 'http://localhost:5000/strikes',
            success: function (data) {
                var strikes_div = $('#strikes');
                var strikes_length = $('#strikes > p').text().length;
                strikes_div.empty();
                var strikes_p = $('<p></p>');
                var s = '';
                for (let i = 0; i < data.strikes; i++) {
                    s += 'X ';
                }
                if (s.length > strikes_length) {
                    document.getElementById("strike-sound").play();
                }
                strikes_p.text(s);
                strikes_p.appendTo(strikes_div);
            },
            complete: function (data) {
                setTimeout(doAjax, 1000);
            }
        }
    );
}