@component('mail::message')
# You're Invited!

You have been invited to attend **{{ $event->title }}**

## Event Details
**When:** {{ $event->start_date->format('F j, Y, g:i a') }} - {{ $event->end_date->format('F j, Y, g:i a') }}
**Where:** {{ $event->location ?: 'TBA' }}

{{ $event->description }}

@component('mail::button', ['url' => url("/rsvp/{$participant->id}/confirm")])
Confirm Attendance
@endcomponent

@component('mail::button', ['url' => url("/rsvp/{$participant->id}/decline")])
Decline
@endcomponent

Thank you,<br>
{{ config('app.name') }}
@endcomponent