import json


class Contest(object):

    def __init__(self):
        with open("contest.api/questions.json", encoding='utf-8') as f:
            self.questions = json.load(f)
        self.current_question = {"question": "",
                                 "answers": []}
        self.score = 0
        self.strikes = 0

    def set_current_question(self, question_index):
        self.current_question_idx = question_index
        self.current_question["question"] = self.questions[question_index]["question"]
        self.current_question["answers"] = [
            "" for _ in self.questions[question_index]["answers"]]
        return

    def get_current_question(self):
        return self.questions[self.current_question_idx]

    def reveal_answer(self, answer_num):
        self.current_question["answers"][answer_num] = self.questions[self.current_question_idx]["answers"][answer_num]
        return
