from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

from rest_framework.views import APIView
from rest_framework import authentication, permissions
from .serializers import MyOrderSerializer
<<<<<<< HEAD
from backend.core.models import Product

from rest_framework.decorators import api_view
=======
from core.models import ProductSizePrice
>>>>>>> ee55c55 (out of stock functionality working, but keeps giving 400 error on checkout)

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
            # Save the order
            order = serializer.save(user=request.user, paid_amount=paid_amount)

            # Reduce stock quantity for each ordered item
            for item in serializer.validated_data['items']:
                product_id = item.get('product')  # ID of the product
                size_id = item.get('size')        # ID of the size
                ordered_quantity = item['quantity']

                # Check if size_id is provided
                if size_id is None:
                    return Response({"error": "Size is required for each item."}, status=status.HTTP_400_BAD_REQUEST)

                # Get the specific ProductSizePrice instance based on product and size
                try:
                    product_size_instance = ProductSizePrice.objects.get(product_id=product_id, size_id=size_id)
                except ProductSizePrice.DoesNotExist:
                    return Response(
                        {"error": f"Product or size not found for product ID {product_id} and size ID {size_id}."},
                        status=status.HTTP_404_NOT_FOUND
                    )

                # Check if there is enough stock
                if product_size_instance.stock >= ordered_quantity:
                    product_size_instance.stock -= ordered_quantity
                    product_size_instance.save()
                else:
                    return Response(
                        {"error": f"Not enough stock for product: {product_size_instance.product.name}, size: {product_size_instance.size.name}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Return order data upon successful order creation
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(f"error : {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # If serializer is invalid, return errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderList(APIView):
    authentication_classes = [authentication.TokenAuthentication] # uses token and permission to get order list
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Get orders for the authenticated user
        orders = Order.objects.filter(user=request.user) # gets order based on user
        serializer = MyOrderSerializer(orders, many=True) # uses my order serializer
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


