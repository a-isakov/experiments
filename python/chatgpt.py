# import openai
from openai import OpenAI

print("API Key:")
# openai.api_key = input()

# response = openai.ChatCompletion.create(
#     model="gpt-3.5",  # или "gpt-4" в зависимости от ваших прав доступа
#     messages=[
#         {"role": "system", "content": "Вы помощник."},
#         {"role": "user", "content": "Как использовать API ChatGPT?"}
#     ]
# )

# print(response.choices[0].message['content'])

api_key = input()
client = OpenAI(api_key=api_key)
# client.api_key = input()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say this is a test"}]
)
# for chunk in stream:
#     if chunk.choices[0].delta.content is not None:
#         print(chunk.choices[0].delta.content, end="")
print(response.choices[0].message['content'])