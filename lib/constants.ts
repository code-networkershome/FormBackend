import { Mail, MessageSquare, Calendar, UserPlus } from "lucide-react";

export const TEMPLATES = [
    {
        id: "contact",
        title: "Simple Contact Form",
        category: "Contact",
        icon: Mail,
        desc: "The essential contact form for any website.",
        html: (endpoint: string) => `<form action="${endpoint}" method="POST" class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-1">Name</label>
    <input type="text" name="name" required class="w-full rounded-lg border border-slate-200 px-4 py-2" />
  </div>
  <div>
    <label class="block text-sm font-medium mb-1">Email</label>
    <input type="email" name="email" required class="w-full rounded-lg border border-slate-200 px-4 py-2" />
  </div>
  <div>
    <label class="block text-sm font-medium mb-1">Message</label>
    <textarea name="message" required class="w-full rounded-lg border border-slate-200 px-4 py-2 h-32"></textarea>
  </div>
  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Send Message</button>
</form>`
    },
    {
        id: "feedback",
        title: "Customer Feedback",
        category: "Feedback",
        icon: MessageSquare,
        desc: "Gather insights and ratings from your users.",
        html: (endpoint: string) => `<form action="${endpoint}" method="POST" class="space-y-4">
  <p class="font-bold">How would you rate our service?</p>
  <div class="flex gap-4">
    <label><input type="radio" name="rating" value="1" /> 1</label>
    <label><input type="radio" name="rating" value="2" /> 2</label>
    <label><input type="radio" name="rating" value="3" /> 3</label>
    <label><input type="radio" name="rating" value="4" /> 4</label>
    <label><input type="radio" name="rating" value="5" /> 5</label>
  </div>
  <textarea name="feedback" placeholder="What can we improve?" class="w-full rounded-lg border border-slate-200 px-4 py-2"></textarea>
  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Submit</button>
</form>`
    },
    {
        id: "rsvp",
        title: "Event RSVP",
        category: "Registration",
        icon: Calendar,
        desc: "Manage guest lists for webinars, meetups, and parties.",
        html: (endpoint: string) => `<form action="${endpoint}" method="POST" class="space-y-4">
  <input type="text" name="guest_name" placeholder="Full Name" required class="w-full rounded-lg border px-4 py-2" />
  <input type="email" name="guest_email" placeholder="Email" required class="w-full rounded-lg border px-4 py-2" />
  <select name="attending" class="w-full rounded-lg border px-4 py-2">
    <option value="yes">Yes, I'm coming!</option>
    <option value="no">Sorry, can't make it</option>
  </select>
  <textarea name="dietary" placeholder="Dietary requirements (optional)" class="w-full rounded-lg border px-4 py-2"></textarea>
  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">RSVP</button>
</form>`
    },
    {
        id: "newsletter",
        title: "Newsletter Signup",
        category: "Signup",
        icon: UserPlus,
        desc: "Grow your email list with a clean signup form.",
        html: (endpoint: string) => `<form action="${endpoint}" method="POST" class="flex gap-2">
  <input type="email" name="subscriber_email" placeholder="you@example.com" required class="flex-1 rounded-lg border border-slate-200 px-4 py-2" />
  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold whitespace-nowrap">Join Now</button>
</form>`
    }
];
