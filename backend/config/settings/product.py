"""
【執筆メモStart】
ローカル開発環境用の設定です。
base.pyに上書きして使用されます。
【執筆メモEnd】
"""

from .base import *


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'app_product',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': 'host.docker.internal',
        'PORT': '53306',
        'ATOMIC_REQUESTS': True
    }
}
