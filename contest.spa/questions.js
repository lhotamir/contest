function addStrike() {
  $.ajax({
    type: 'PUT',
    url: 'http://localhost:5000/strikes'
  });
}

function reset() {
  $.ajax({
    type: 'PUT',
    url: 'http://localhost:5000/reset',
    success: function (data) {
      location.reload(true);
    }
  });
}

function loadQuestions() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/questions',
    success: function(data) {
      var questions_div = $('#questions');
      var list = $('<ul></ul>');
      $('#answers').empty();
      $.each(data, function(i) {
        var li = $('<li></li>')
          .text(data[i].question)
          .appendTo(list);
        var button = $(
          '<button type="button" onclick="setQuestion(' +
            i +
            ')">Nastav</button>'
        );
        button.appendTo(li);
        var button2 = button.clone();
        /*button2.attr('onclick', 'setQuestion(' + i + ', true)');
        button2.text('Nastav - Finále');
        button2.appendTo(li);*/
      });
      questions_div.append(list);
    }
  });
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/final_questions',
    success: function(data) {
      var questions_div = $('#final_questions');
      var list = $('<ul></ul>');
      $('#answers').empty();
      $.each(data, function(i) {
        var li = $('<li></li>')
          .text(data[i].question)
          .appendTo(list);
        var button = $(
          '<button type="button" onclick="setQuestion(' +
            i +
            ', true)">Nastav - Finále</button>'
        );
        button.appendTo(li);
      });
      questions_div.append(list);
    }
  });
}

function revealAnswer(answer_idx, count_score = false, final = false) {
  var url = 'http://localhost:5000/reveal/' + answer_idx;
  url += '?count_score=' + count_score;
  url += '&final=' + final;
  $.ajax({
    type: 'PUT',
    url: url
  });
}

function setQuestion(question_idx, final = false) {
  var question = $('#questions > ul > li:eq(' + question_idx + ')');
  $.ajax({
    type: 'PUT',
    url: 'http://localhost:5000/set/' + question_idx + '?final=' + final,
    data: ''
  });
  $.ajax({
    type: 'GET',
    url:
      'http://localhost:5000/' +
      (final ? 'final_' : '') +
      'questions/' +
      question_idx,
    success: function(data) {
      var displayed_answers = $('[id$=questions] > ul > li > ul');
      $.each(displayed_answers, function(i) {
        displayed_answers[i].remove();
      });
      if (final) {
        var question = $('#final_questions > ul > li:eq(' + question_idx + ')');
      } else {
        var question = $('#questions > ul > li:eq(' + question_idx + ')');
      }
      var list = $('<ul></ul>');
      //$('#answers').empty();
      $.each(data.answers, function(i) {
        var li = $('<li></li>')
          .text(data.answers[i].answer)
          .appendTo(list);
        if (final) {
          var button3 = $('<button></button>');
          button3.text('Ukaž - finále');
          button3.attr('onclick', 'revealAnswer(' + i + ', true, true)');
          button3.appendTo(li);
        } else {
          var button = $('<button></button>');
          button.attr('onclick', 'revealAnswer(' + i + ', true)');
          button.text('Ukaž');
          var button2 = $('<button></button>');
          button2.text('Ukaž bez bodů');
          button2.attr('onclick', 'revealAnswer(' + i + ', false)');
          button.appendTo(li);
          button2.appendTo(li);
        }
      });
      question.append(list);
      if (final) {
        var input_li = $('<li></li>');
        input_li.text('Nová odpověď: ');
        var input_answer = $('<input></input>');
        input_answer.attr('id', 'new_answer');
        input_answer.attr('type', 'text');
        input_answer.appendTo(input_li);
        var input_points = $('<input></input>');
        input_points.attr('id', 'new_points');
        input_points.attr('type', 'text');
        input_points.appendTo(input_li);
        var answer_button = $('<button>Přidej odpověď</button>');
        answer_button.attr('onclick', 'addAnswer(' + question_idx + ')');
        answer_button.appendTo(input_li);
        input_li.appendTo(list);
      }
    }
  });
}

function addAnswer(question_idx) {
  var new_answer = $('#new_answer').val();
  var new_points = $('#new_points').val();
  if (new_answer != '') {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/final_questions/' + question_idx + '/answers',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ answer: new_answer, points: parseInt(new_points) }),
      success: function(data) {
        var displayed_answers = $('[id$=questions] > ul > li > ul');
        $.each(displayed_answers, function(i) {
          displayed_answers[i].remove();
        });
        var question = $('#final_questions > ul > li:eq(' + question_idx + ')');
        var list = $('<ul></ul>');
        $.each(data.answers, function(i) {
          var li = $('<li></li>')
            .text(data.answers[i].answer)
            .appendTo(list);
          var button3 = $('<button></button>');
          button3.text('Ukaž - finále');
          button3.attr('onclick', 'revealAnswer(' + i + ', true, true)');
          button3.appendTo(li);
        });
        question.append(list);
        var input_li = $('<li></li>');
        input_li.text('Nová odpověď: ');
        var input_answer = $('<input></input>');
        input_answer.attr('id', 'new_answer');
        input_answer.attr('type', 'text');
        input_answer.appendTo(input_li);
        var input_points = $('<input></input>');
        input_points.attr('id', 'new_points');
        input_points.attr('type', 'text');
        input_points.appendTo(input_li);
        var answer_button = $('<button>Přidej odpověď</button>');
        answer_button.attr('onclick', 'addAnswer(' + question_idx + ')');
        answer_button.appendTo(input_li);
        input_li.appendTo(list);
      }
    });
  }
}
