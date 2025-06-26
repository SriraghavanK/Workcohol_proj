from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.CharField(max_length=10, required=False, default='mentee')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'user_type']
    
    def create(self, validated_data):
        user_type = validated_data.pop('user_type', 'mentee')
        
        # Create the user
        user = User.objects.create_user(**validated_data)
        
        # Create or update the profile with the correct user_type
        # This will trigger the signal to create MentorProfile if user_type is 'mentor'
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={'user_type': user_type}
        )
        
        # If profile already exists (created by signal), update it
        if not created:
            profile.user_type = user_type
            profile.save()
        
        return user 