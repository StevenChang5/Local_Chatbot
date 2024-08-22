from flask import Flask, redirect, render_template,url_for, request, jsonify
import time
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

app = Flask(__name__)

model = OllamaLLM(model="llama3.1")

prompt = ChatPromptTemplate.from_template("""
Provide a summary for the following text:

Text: {input}""")

output_parser = StrOutputParser()

chain = prompt | model | output_parser

# '/' URL bound to hello_world()
@app.route('/')
def start():
    return render_template("index.html")

@app.route('/llm',methods=['POST'])
def process_request():
    user_input = request.form['input']
    user_input = f"{user_input}"
    data = chain.invoke(user_input)
    response_html = f"<user>User: {user_input}</user><bot>Bot: {data}</bot>"
    return response_html

# main driver function, runs application on local dev server
if __name__ == '__main__':
    app.run(debug=True)