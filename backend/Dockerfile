FROM python:3.10-slim
ARG environment_name
ENV environment=$environment_name
RUN mkdir /code
WORKDIR /code
ADD . /code/
RUN pip install -r requirements.lock
ENTRYPOINT python manage.py runserver --settings config.settings.${environment}
