# Dockerイメージを指定
FROM python:3.12-bullseye

# docker-compose.ymlで指定したenvironment_nameを設定
ARG environment_name
ENV environment=$environment_name

# codeというディレクトリを作成しソースコードを配置、pip installでライブラリをインストール
RUN mkdir /code
WORKDIR /code
ADD . /code/
RUN pip install -r requirements.lock

# Djangoを起動
ENTRYPOINT python manage.py runserver 0.0.0.0:8000 --settings config.settings.${environment}
