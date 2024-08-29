from flask import Flask, redirect, render_template,url_for, request, jsonify, stream_with_context,Response
import time, os
from langchain_ollama.llms import OllamaLLM
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.documents import Document
from uuid import uuid4
from model import *
app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

    for chunk in rag_chain.stream({"input": user_input, "chat_history":chat_history}):
        if 'answer' in chunk:
            print(chunk["answer"])
    return chunk["answer"]

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