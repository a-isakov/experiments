import json


with open('scoring.json') as cat_file:
    data = json.load(cat_file)
    # print(data)
    tests_count = 0
    for group in data['scoring']:
        # print(group)
        for n in group['required_tests']:
            if n > tests_count:
                tests_count = n
    
    # print(tests_count)
    passed = []
    for i in range(tests_count):
        pass
        answer = input()
        if answer == 'ok':
            passed.append(i + 1)
    # print(passed)
    passed = set(passed)

    score = 0
    for group in data['scoring']:
        required = set(group['required_tests'])
        common = required & passed
        # if required & passed == required:
        #     score += group['points']
        score += group['points'] * len(common) // len(required)
    print(score)
