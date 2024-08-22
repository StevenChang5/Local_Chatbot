from flask import Flask, redirect, render_template,url_for, request, jsonify
import time
from model import *
app = Flask(__name__)

# '/' URL bound to hello_world()
@app.route('/')
def start():
    return render_template("index.html")

@app.route('/llm',methods=['POST'])
def process_request():
    global chat_history
    user_input = request.form['input']
    user_input = f"{user_input}"
    if len(chat_history) > 0:
        data = retrieval_chain.invoke({
            "chat_history": chat_history, 
            "input": user_input
            })['answer']
    else:
        data = retrieval_chain.invoke({
            "chat_history": MessagesPlaceholder(variable_name="chat_history"), 
            "input": user_input
            })['answer']
        
    response_html = f"""
    <div class="chat-bubble chat-bubble-bot">
        <div class="chat-bubble-text-bot">{data}</div>
    </div>
    <div class="chat-bubble chat-bubble-user">
        <div class="chat-bubble-text-user">{user_input}</div>
    </div>
    """
    if len(chat_history) >= MAX_HISTORY:
        chat_history = chat_history[2:]
    chat_history.append(HumanMessage(content=user_input))
    chat_history.append(AIMessage(content=data))

    return response_html

# main driver function, runs application on local dev server
if __name__ == '__main__':
    app.run(debug=True)