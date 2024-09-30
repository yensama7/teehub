from django.conf import settings
from django.contrib.auth.models import User
from django.db import transaction
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

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = OrderSerializer(data=request.data)
    
    if serializer.is_valid():
        # Calculate total paid amount
        paid_amount = sum(item.get('quantity') * item.get('product').price for item in serializer.validated_data['items'])

        try:

            serializer.save(user=request.user, paid_amount=paid_amount)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"error : {e}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderList(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        # Get orders for the authenticated user
        orders = Order.objects.filter(user=request.user)
        serializer = MyOrderSerializer(orders, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    


@csrf_exempt  # You might need to exempt CSRF for this endpoint
@api_view(['POST'])
def flutterwave_payment_confirmation(request):
    try:
        # Get the request data
        data = json.loads(request.body)

        # Verify that the status indicates a successful payment
        if data.get('status') == 'success':
            # Extract relevant information from the data
            transaction_id = data.get('data').get('id')
            amount = data.get('data').get('amount')
            reference = data.get('data').get('tx_ref')

            # Find the corresponding order in the database
            try:
                order = Order.objects.get(reference=reference)
                order.paid_amount = amount
                order.save()

                # Here you might want to perform additional actions, like sending a confirmation email

                return JsonResponse({'message': 'Payment confirmed successfully!'}, status=200)

            except Order.DoesNotExist:
                return JsonResponse({'error': 'Order not found.'}, status=404)

        return JsonResponse({'error': 'Payment not successful.'}, status=400)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

