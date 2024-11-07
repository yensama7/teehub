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
from backend.core.models import Product

from rest_framework.decorators import api_view

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = OrderSerializer(data=request.data)
    
    if serializer.is_valid():
        paid_amount = sum(
            item['quantity'] * item['price'] for item in serializer.validated_data['items']
        )

        try:
            order = serializer.save(user=request.user, paid_amount=paid_amount)
        
        # Reduce stock quantity for each ordered item
            for item in serializer.validated_data['items']:
                product = item['product']  # Assuming 'product' is an ID or object
                ordered_quantity = item['quantity']
                
                # Get the product and reduce its stock
                product_instance = Product.objects.get(id=product)
                if product_instance.stock >= ordered_quantity:
                    product_instance.stock -= ordered_quantity
                    product_instance.save()
                else:
                    return Response({"error": "Not enough stock for product: {}".format(product_instance.name)}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"error : {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderList(APIView):
    authentication_classes = [authentication.TokenAuthentication] # uses token and permission to get order list
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Get orders for the authenticated user
        orders = Order.objects.filter(user=request.user) # gets order based on user
        serializer = MyOrderSerializer(orders, many=True) # uses my order serializer
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


