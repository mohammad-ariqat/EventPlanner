@component('mail::message')
# We'd Like Your Feedback

Thank you for attending **{{ $event->title }}**!

We'd appreciate your feedback on the event. This will help us improve future events.

@component('mail::button', ['url' => url("/feedback/{$participant->id}")])
Provide Feedback
@endcomponent

Thank you,<br>
{{ config('app.name') }}
@endcomponent