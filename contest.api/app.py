from flask import Flask, Response
from flask import json
from flask import request, send_from_directory
from flask_cors import CORS
import logging
import contest
logging.getLogger('flask_cors').level = logging.DEBUG
app = Flask(__name__, static_url_path='/client',
            static_folder="../contest.spa")
cors = CORS(app)
app.config['JSON_AS_ASCII'] = False
app.config['CORS_AUTOMATIC_OPTIONS'] = True
contest_state = contest.Contest()


def build_response(data=None, status=200):
    return Response(response=json.dumps(data).encode("utf-8"), status=status, content_type="application/json; charset=utf-8")

@app.route("/current")
def get_current():
    return build_response(contest_state.current_question)


@app.route("/reset", methods=["PUT"])
def reset():
    contest_state.reset()
    return build_response(status=204)


@app.route("/strikes", methods=["GET"])
def get_strikes():
    return build_response(data={"strikes": contest_state.strikes})


@app.route("/strikes", methods=["PUT"])
def add_strike():
    contest_state.strikes += 1
    return build_response(status=204)


@app.route("/set/<question_id>", methods=["PUT"])
def set_current(question_id):
    if request.args.get('final') == 'true':
        final = True
    else:
        final = False
    try:
        if int(question_id) == -1:
            contest_state.current_question["question"] = ""
            contest_state.current_question["answers"] = []
            contest_state.strikes = 0
        else:
            contest_state.set_current_question(int(question_id), final)
    except IndexError:
        return build_response(data={"error": "No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error": "Wrong index"})
    return build_response(status=204)


@app.route("/score", methods=["GET"])
def get_score():
    return build_response(data={"score": contest_state.score})


@app.route("/reveal/<answer_num>", methods=["PUT"])
def reveal_answer(answer_num):
    if request.args.get("count_score") == 'true':
        count_score = True
    else:
        count_score = False
    try:
        if request.args.get("final") == 'true':
            contest_state.final_reveal(int(answer_num))
        else:
            contest_state.reveal_answer(int(answer_num), count_score)
    except IndexError:
        return build_response(data={"error": "Answer not found"}, status=404)
    except ValueError:
        return build_response(data={"error": "Wrong index"}, status=400)
    return build_response(status=204)


@app.route("/questions/<question_id>")
def get_question(question_id):
    try:
        return build_response(data=contest_state.questions[int(question_id)])
    except IndexError:
        return build_response(data={"error": "No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error": "Wrong index"}, status=400)


@app.route("/final_questions/<question_id>")
def get_final_question(question_id):
    try:
        return build_response(data=contest_state.final_questions[int(question_id)])
    except IndexError:
        return build_response(data={"error": "No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error": "Wrong index"}, status=400)


@app.route("/final_questions/<question_id>/answers", methods=["POST"])
def add_final_question_answer(question_id):
    try:
        data = request.get_json()
        contest_state.final_questions[int(question_id)]["answers"].append(
            {"answer": data["answer"], "points": data["points"]})
        return build_response(data=contest_state.final_questions[int(question_id)])
    except IndexError:
        return build_response(data={"error": "No such question present"}, status=404)
    except ValueError:
        return build_response(data={"error": "Wrong index"}, status=400)


@app.route("/questions")
def get_questions():
    return build_response(data=contest_state.questions)


@app.route("/final_questions")
def get_final_questions():
    return build_response(data=contest_state.final_questions)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
