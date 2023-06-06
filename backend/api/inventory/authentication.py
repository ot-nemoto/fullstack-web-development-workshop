"""
【執筆メモStart】
認証クラスをカスタマイズし、リクエストヘッダーに自動的にtokenをセットする
https://qiita.com/shitikakei/items/d818fb0aa8670aa4228c
https://stackoverflow.com/questions/65343097/django-reactjs-the-httponly-cookie-is-not-saved-in-the-browser-at-react-side
【執筆メモEnd】
"""
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJWTAuthentication(JWTAuthentication):
    def get_header(self, request):
        token = request.COOKIES.get('access')
        request.META['HTTP_AUTHORIZATION'] = '{header_type} {access_token}'.format(
                header_type="Bearer", access_token=token)
        return super().get_header(request)

    # def authenticate(self, request):
    #     # Cookieヘッダーからaccess_tokenを取得
    #     access_token = request.COOKIES.get('access')
    #     if not access_token:
    #         Response({"message": 'no Token'})
    #     else:
    #         Response(access_token)

    #     if access_token:
    #         # request.META['HTTP_AUTHORIZATION'] = '{header_type} {access_token}'.format(
    #         #     header_type=settings.SIMPLE_JWT['AUTH_HEADER_TYPES'][0], access_token=access_token)
    #         request.META['HTTP_AUTHORIZATION'] = '{header_type} {access_token}'.format(
    #             header_type="Bearer", access_token=access_token)

    #     # JWTAuthenticationのauthenticate()
    #     return super().authenticate(request)