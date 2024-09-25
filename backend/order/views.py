from django.conf import settings
from django.contrib.auth.models import User
from django.http import Http404

from rest_framework import status, authentication, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import render
from .models import Order, OrderItem
from .serializers import  OrderSerializer, MyOrderSerializer

@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    serializer = OrderSerializer(data=request.data)


    if serializer.is_valid():
        # Calculate the total paid amount
        total_paid_amount = 0
        for item in serializer.validated_data['items']:
            product = item['product']
            quantity = item['quantity']
            total_paid_amount += product.price * quantity

        # Create the order with the calculated paid amount
        try:
            serializer.save(user=request.user, paid_amount=total_paid_amount)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class OrderList(APIView):
    authentication_classes= [authentication.TokenAuthentication]
    permission_classes= [permissions.IsAuthenticated]

    def get(self, request, format=None):
        orders= Order.objects.filter(user=request.user)
        serializer = MyOrderSerializer(orders, many=True)
        return Response(serializer.data)