from flask import Flask, render_template, request, jsonify
import os
from langchain_ollama.llms import OllamaLLM
from langchain_core.messages import HumanMessage
from uuid import uuid4
from model import *
app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def start():
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
    """
    chat_history.extend([HumanMessage(content=user_input), data["answer"]])
    return response_html

@app.route('/upload',methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
    print(request.files)
    print(request.files['file'])
    print(request.files.getlist('file'))
    file = request.files['file']
    files = request.files.getlist('file')
    response_html = f""
    for file in files:
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        temp_load = PyPDFLoader(filepath)
        document_pages = temp_load.load_and_split()
        uuids = [str(uuid4()) for _ in range(len(document_pages))]
        vector.add_documents(documents=document_pages, ids=uuids)
        os.remove(filepath)
        response_html += f"""
        <a>{file.filename}</a>
        """
    
    return response_html

# main driver function, runs application on local dev server
if __name__ == '__main__':
    app.run(debug=True)