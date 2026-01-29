import { Mail, MessageSquare, Calendar, UserPlus } from "lucide-react";

import contactTemplate from "../templates/contact.json";
import feedbackTemplate from "../templates/feedback.json";
import rsvpTemplate from "../templates/rsvp.json";
import newsletterTemplate from "../templates/newsletter.json";
import surveyTemplate from "../templates/survey.json";
import waitlistTemplate from "../templates/waitlist.json";

export interface TemplateField {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface TemplateDefinition {
  id: string;
  version: number;
  category: string;
  display_name: string;
  description: string;
  suggested_fields: TemplateField[];
  example_html: string;
  example_fetch: string;
  default_settings: {
    success_url: string;
    subject: string;
  };
  icon: any; // Lucide icon
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    ...contactTemplate,
    icon: Mail
  },
  {
    ...feedbackTemplate,
    icon: MessageSquare
  },
  {
    ...rsvpTemplate,
    icon: Calendar
  },
  {
    ...newsletterTemplate,
    icon: UserPlus
  },
  {
    ...surveyTemplate,
    icon: MessageSquare
  },
  {
    ...waitlistTemplate,
    icon: Calendar
  }
];

export const getTemplateById = (id: string | null) => {
  if (!id) return null;
  return TEMPLATES.find(t => t.id === id) || null;
};
