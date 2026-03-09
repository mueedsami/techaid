export type ClientItem = {
  id: string;
  name: string;
  type: "University" | "Industry" | "Government" | "Institute" | "Research" | "Private";
  sector: string;
  summary: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

export const clients: ClientItem[] = [
  {
    id: "c1",
    name: "Leading Private University",
    type: "University",
    sector: "Engineering Education",
    summary: "Supplied and supported engineering laboratory and training equipment for academic use.",
  },
  {
    id: "c2",
    name: "Industrial Manufacturing Plant",
    type: "Industry",
    sector: "Power & Automation",
    summary: "Provided electrical panel, servicing, and technical support for reliable plant operations.",
  },
  {
    id: "c3",
    name: "Technical Training Institute",
    type: "Institute",
    sector: "Skills Development",
    summary: "Designed and delivered practical training kits for hands-on technical learning.",
  },
  {
    id: "c4",
    name: "Government Organization",
    type: "Government",
    sector: "Public Infrastructure",
    summary: "Supported supply and installation requirements with standards-compliant execution.",
  },
  {
    id: "c5",
    name: "Research Laboratory",
    type: "Research",
    sector: "Lab & Testing",
    summary: "Sourced specialized equipment and components with technical evaluation and delivery support.",
  },
  {
    id: "c6",
    name: "Private Engineering Firm",
    type: "Private",
    sector: "Design & Implementation",
    summary: "Assisted with design, fabrication support, and system implementation for project delivery.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    quote:
      "Technical Aid delivered exactly what we needed for our lab setup. Their technical understanding and support quality were excellent.",
    name: "Project Coordinator",
    role: "Lab Development Team",
    company: "Academic Institution",
  },
  {
    id: "t2",
    quote:
      "From sourcing to installation, the process was smooth and professional. Their team maintained strong communication throughout.",
    name: "Operations Engineer",
    role: "Maintenance & Utilities",
    company: "Industrial Client",
  },
  {
    id: "t3",
    quote:
      "Their practical training equipment and guidance helped us improve hands-on learning for our students significantly.",
    name: "Department Head",
    role: "Technical Education",
    company: "Training Institute",
  },
];