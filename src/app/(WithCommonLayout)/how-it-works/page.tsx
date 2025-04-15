import SectionHeading from "@/components/shared/SectionHeading";
import { CheckCircle, User, Utensils } from "lucide-react";

const stepsCustomer = [
  {
    title: "Create an Account",
    description:
      "Sign up using your email or phone. Your account is protected with secure authentication (JWT & bcrypt).",
  },
  {
    title: "Set Dietary Preferences",
    description:
      "Choose from vegan, keto, gluten-free, and more. Customize portion sizes and preferred cuisines.",
  },
  {
    title: "Browse Meals",
    description:
      "Use filters like diet type, ratings, and cuisine to explore meals from trusted providers.",
  },
  {
    title: "Customize & Schedule",
    description:
      "Select meals, tweak ingredients, and schedule delivery based on your availability.",
  },
  {
    title: "Track Orders",
    description: "Monitor your orders in real-time right from your dashboard.",
  },
];

const stepsProvider = [
  {
    title: "Register as a Provider",
    description:
      "Create a profile highlighting your cuisine, pricing, and availability.",
  },
  {
    title: "Post Your Menu",
    description:
      "Add detailed meal options, ingredients, portion sizes, and pricing.",
  },
  {
    title: "Receive Orders",
    description:
      "Get notified when customers order meals matching your offerings.",
  },
  {
    title: "Accept & Prepare Meals",
    description:
      "Confirm or adjust orders and prepare them based on the customer’s schedule.",
  },
  {
    title: "Deliver & Build Trust",
    description: "Deliver on time and gather reviews to build your reputation.",
  },
];

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  steps: Array<{ title: string; description: string }>;
}

const Section = ({ title, icon, steps }: SectionProps) => (
  <div className="bg-muted p-6 rounded-2xl shadow-sm mb-10">
    <div className="flex items-center gap-2 mb-6">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="grid gap-5">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-background p-4 rounded-xl border"
        >
          <CheckCircle className="text-primary w-5 h-5 mt-1" />
          <div>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HowItWorkPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-30">
      <SectionHeading
        title="How It Works"
        subtitle="Whether you're customizing your perfect meal plan or providing
          delicious dishes, Meal Box brings convenience, nutrition, and
          connection to your table."
      />

      <Section
        title="For Customers"
        icon={<User className="text-secondary" />}
        steps={stepsCustomer}
      />

      <Section
        title="For Meal Providers"
        icon={<Utensils className="text-secondary" />}
        steps={stepsProvider}
      />
    </div>
  );
};

export default HowItWorkPage;
