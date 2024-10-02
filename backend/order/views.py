from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework.response import Response
from .models import Order
from .serializers import MyOrderSerializer

from rest_framework.decorators import api_view

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = OrderSerializer(data=request.data) # send the data to order serializer when checkout is called
    
    if serializer.is_valid():
        # Calculate total paid amount
        paid_amount = sum(item.get('quantity') * item.get('product').price for item in serializer.validated_data['items']) # get the amount paid from the response

        try:

            serializer.save(user=request.user, paid_amount=paid_amount, items= serializer.validated_data['items']) # sends the info to the backend with amount paid and order details

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"error : {e}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderList(APIView):
    authentication_classes = [authentication.TokenAuthentication] # uses token and permission to get order list
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Get orders for the authenticated user
        orders = Order.objects.filter(user=request.user) # gets order based on user
        serializer = MyOrderSerializer(orders, many=True) # uses my order serializer
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


