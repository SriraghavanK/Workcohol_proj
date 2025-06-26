from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer

# Create your views here.

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()     
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Booking.objects.all()
        
        # If user is a mentor, show bookings where they are the mentor
        if hasattr(user, 'profile') and user.profile.user_type == 'mentor':
            return Booking.objects.filter(mentor__user=user)
        
        # If user is a mentee, show their bookings
        return Booking.objects.filter(mentee=user)

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        serializer.save(mentee=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Mentor accepts a booking"""
        booking = self.get_object()
        
        # Check if user is the mentor for this booking
        if booking.mentor.user != request.user:
            return Response({'error': 'Only the mentor can accept this booking'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if booking.status != 'pending':
            return Response({'error': 'Only pending bookings can be accepted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'confirmed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        """Mentor declines a booking"""
        booking = self.get_object()
        
        # Check if user is the mentor for this booking
        if booking.mentor.user != request.user:
            return Response({'error': 'Only the mentor can decline this booking'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if booking.status != 'pending':
            return Response({'error': 'Only pending bookings can be declined'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark booking as completed"""
        booking = self.get_object()
        
        # Check if user is the mentor for this booking
        if booking.mentor.user != request.user:
            return Response({'error': 'Only the mentor can complete this booking'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if booking.status != 'confirmed':
            return Response({'error': 'Only confirmed bookings can be completed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'completed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking (mentee or mentor)"""
        booking = self.get_object()
        
        # Check if user is the mentee or mentor
        if booking.mentee != request.user and booking.mentor.user != request.user:
            return Response({'error': 'You can only cancel your own bookings'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if booking.status in ['completed', 'cancelled']:
            return Response({'error': 'This booking cannot be cancelled'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming bookings"""
        queryset = self.get_queryset().filter(status__in=['pending', 'confirmed'])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past bookings"""
        queryset = self.get_queryset().filter(status__in=['completed', 'cancelled'])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
