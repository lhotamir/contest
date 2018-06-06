from flask import Flask, Response
from flask import json
from flask import request
import contest

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
contest_state = contest.Contest()

def build_response(data=None, status=200):
    return Response(response=json.dumps(data).encode("utf-8"), status=status, content_type="application/json; charset=utf-8", headers={"Access-Control-Allow-Origin": "*"})

@app.route("/current")
def get_current():
    return build_response(contest_state.current_question)

@app.route("/reset")
def reset():
    contest_state = contest.Contest()

@app.route("/strikes", methods=["GET"])
def get_strikes():
    return build_response(data={"strikes":contest_state.strikes})

@app.route("/strikes", methods=["PUT"])
def add_strike():
    contest_state.strikes += 1
    return build_response(status=204)

@app.route("/set/<question_id>", methods=["PUT"])
def set_current(question_id):
    try:
        if int(question_id) == -1:
            contest_state.current_question["question"] = ""
            contest_state.current_question["answers"] = []
        else:
            contest_state.set_current_question(int(question_id))
            contest_state.strikes = 0
    except IndexError:
        return build_response(data={"error":"No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error":"Wrong index"})
    return build_response(status=204)

@app.route("/score", methods=["GET"])
def get_score():
    return build_response(data={"score":contest_state.score})


@app.route("/reveal/<answer_num>", methods=["PUT"])
def reveal_answer(answer_num):
    try:
        contest_state.reveal_answer(int(answer_num))
        if "count_score" in request.args:
            contest_state.score += contest_state.get_current_question()["answers"][int(answer_num)]["points"]
    except IndexError:
       return build_response(data={"error":"Answer not found"}, status=404)
    except ValueError:
        return build_response(data={"error":"Wrong index"}, status=400)
    return build_response(status=204)


@app.route("/question/<question_id>")
def get_question(question_id):
    try:
        return build_response(data=contest_state.questions[int(question_id)])
    except IndexError:
        return build_response(data={"error":"No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error":"Wrong index"}, status=400)


if __name__ == '__main__':
    app.run(debug=True)
