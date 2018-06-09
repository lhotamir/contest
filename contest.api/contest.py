import json


class Contest(object):

    SCORE_MULTIPLIER = {5:2, 4:3}

    def __init__(self):
        with open("contest.api/questions.json", encoding='utf-8') as f:
            data = json.load(f)
            self.questions = data["questions"]
            self.final_questions = data["final_questions"]
        self.current_question = {"question": "",
                                 "answers": []}
        self.score = 0
        self.strikes = 0

    def set_current_question(self, question_index, final=False):
        self.score = 0
        self.strikes = 0
        self.current_question_idx = question_index
        self.current_question["question"] = self.final_questions[question_index]["question"] if final else self.questions[question_index]["question"]
        self.current_question["answers"] = []
        if not final:
            self.current_question["answers"] = [
                "" for _ in self.questions[question_index]["answers"]]
        return

    def get_current_question(self):
        return self.questions[self.current_question_idx]

    def reveal_answer(self, answer_num, count_score=True):
        self.current_question["answers"][answer_num] = self.questions[self.current_question_idx]["answers"][answer_num]
        if count_score:
            question_score = self.questions[self.current_question_idx]["answers"][answer_num]["points"]
            try:
                question_score *= self.SCORE_MULTIPLIER[len(self.questions[self.current_question_idx]["answers"])]
            except KeyError:
                pass
            self.score += question_score
        return

    def final_reveal(self, answer_num):
        self.current_question["answers"].append(
            self.final_questions[self.current_question_idx]["answers"][answer_num])
