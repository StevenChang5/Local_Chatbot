from langchain_ollama.llms import OllamaLLM
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import WebBaseLoader

from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

MAX_HISTORY = 10

model = OllamaLLM(model="llama3.1")

loader = WebBaseLoader("https://docs.smith.langchain.com/user_guide")
docs = loader.load()
embeddings_model = OllamaEmbeddings(model="nomic-embed-text")
text_splitter = RecursiveCharacterTextSplitter()
documents = text_splitter.split_documents(docs)
vector = FAISS.from_documents(documents, embeddings_model)

prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{input}"),
    ("user", "You are a world class asssistant."),
    ("user", "Given the above conversation, generate a search query to look up to get information relevant to the conversation")
])

prompt = ChatPromptTemplate.from_template("""
<context>
{context}
</context>

Question: {input}""")

document_chain = create_stuff_documents_chain(model, prompt)

retriever = vector.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)

chat_history = []