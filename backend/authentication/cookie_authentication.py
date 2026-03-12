# from rest_framework_simplejwt.authentication import JWTAuthentication


# class CookieJWTAuthentication(JWTAuthentication):

#     def authenticate(self, request):

#         # Try to get header first
#         header = self.get_header(request)

#         if header is not None:
#             raw_token = self.get_raw_token(header)
#         else:
#             # If no header, read token from cookie
#             raw_token = request.COOKIES.get("access")
#             if raw_token:
#                 raw_token = raw_token.encode("utf-8")  #

#         if raw_token is None:
#             return None
        


#         validated_token = self.get_validated_token(raw_token)

#         user = self.get_user(validated_token)

#         return (user, validated_token)

# from rest_framework_simplejwt.authentication import JWTAuthentication


# class CookieJWTAuthentication(JWTAuthentication):

#     def authenticate(self, request):
#         # Try to get header first
#         header = self.get_header(request)

#         if header is not None:
#             raw_token = self.get_raw_token(header)
#         else:
#             # If no header, read token from cookie
#             raw_token = request.COOKIES.get("access")
#             if raw_token:
#                 raw_token = raw_token.encode("utf-8")

#         if raw_token is None:
#             return None

#         validated_token = self.get_validated_token(raw_token)
#         user = self.get_user(validated_token)

#         return (user, validated_token)


from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        # Try to get header first
        header = self.get_header(request)

        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            # If no header, read token from cookie
            raw_token = request.COOKIES.get("access")
        
        # If no token found, return None (allow unauthenticated access)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            # If token is invalid, return None instead of raising error
            return None

        user = self.get_user(validated_token)

        return (user, validated_token)