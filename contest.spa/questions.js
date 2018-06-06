function addStrike() {
  $.ajax({
    type: 'PUT',
    url: 'http://localhost:5000/strikes',
    headers: {
      Connection: 'close'
    }
  });
}

function loadQuestions() {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/questions',
    headers: {
      Connection: 'close'
    },
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
            ')">Nastav!</button>'
        );
        button.appendTo(li);
      });
      questions_div.append(list);
    }
  });
}

function setQuestion(question_idx) {
  var question = $('#questions > ul > li:eq(' + question_idx + ')');
  $.ajax({
    type: 'PUT',
    url: 'http://localhost:5000/set/' + question_idx,
    data: ''
  });
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5000/questions/' + question_idx,
    success: function(data) {
      var question = $('#questions > ul > li:eq(' + question_idx + ')');
      var list = $('<ul></ul>');
      //$('#answers').empty();
      $.each(data.answers, function(i) {
        var li = $('<li></li>')
          .text(data.answers[i].answer)
          .appendTo(list);
      });
      question.append(list);
    }
  });
}
