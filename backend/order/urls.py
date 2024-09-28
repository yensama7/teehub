from django.urls import path

from order import views

urlpatterns = [
    path('checkout/', views.checkout),
    path('orders/', views.OrderList.as_view()),
    path('flutterwave/payment-confirmation/', views.flutterwave_payment_confirmation, name='flutterwave_payment_confirmation'),
]
