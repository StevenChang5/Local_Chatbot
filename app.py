from flask import Flask, redirect, render_template,url_for, request, jsonify
import time
from langchain_ollama.llms import OllamaLLM
from model import *
app = Flask(__name__)

# '/' URL bound to hello_world()
@app.route('/')
def start():
    model = OllamaLLM(model="llama3.1", base_url="http://ollama-container:11434", verbose=True)
    model.invoke("Hello!")
    return render_template("index.html")

@app.route('/llm',methods=['POST'])
def process_request():
    user_input = request.form['input']
    user_input = f"{user_input}"

    data = rag_chain.invoke({"input": user_input, "chat_history": chat_history})
        
    response_html = f"""
    <div class="chat-bubble chat-bubble-bot">
        <div class="chat-bubble-text-bot">{data["answer"]}</div>
    </div>
    <div class="chat-bubble chat-bubble-user">
        <div class="chat-bubble-text-user">{user_input}</div>
    </div>
    """
    chat_history.extend([HumanMessage(content=user_input), data["answer"]])
    return response_html

# main driver function, runs application on local dev server
if __name__ == '__main__':
    app.run(debug=True)