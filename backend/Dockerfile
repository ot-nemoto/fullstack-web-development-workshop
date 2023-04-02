FROM python:3.10-slim
ARG environment_name
ENV environment=$environment_name
RUN mkdir /code
WORKDIR /code
ADD . /code/
RUN pip install -r requirements.txt
ENTRYPOINT gunicorn -e DJANGO_SETTINGS_MODULE=config.settings.${environment} -c config/gunicorn.conf.py config.wsgi
