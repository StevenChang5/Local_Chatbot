from langchain_ollama.llms import OllamaLLM
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate

from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader

from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.docstore import InMemoryDocstore

from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder

import faiss

chat_history = []

model = OllamaLLM(model="llama3.1", base_url="http://ollama-container:11434", verbose=True)

embeddings_model = OllamaEmbeddings(model="nomic-embed-text")
embedding_dimension = 768
index = faiss.IndexFlatL2(embedding_dimension)
vector = FAISS(
    embedding_function=OllamaEmbeddings(model="nomic-embed-text"), index=index,
    docstore=InMemoryDocstore(),
    index_to_docstore_id={})
retriever = vector.as_retriever()

contextualize_q_system_prompt = """Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."""
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human","{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(
    model, retriever, contextualize_q_prompt
)

qa_system_prompt = """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. 

{context}"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system",qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

question_answer_chain = create_stuff_documents_chain(model, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever,question_answer_chain)