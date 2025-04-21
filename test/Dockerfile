# syntax=docker/dockerfile:1
FROM python:3.12.5-slim
WORKDIR /QandAChat

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV USER_AGENT ="QandA/1.0"
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run", "--debug"]

