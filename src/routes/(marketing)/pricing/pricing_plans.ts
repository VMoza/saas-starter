export const defaultPlanId = "free"

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "A free plan to get you started with Ivy Honor",
    price: "$0",
    priceIntervalName: "per month",
    stripe_price_id: null,
    features: [
      "Access to basic college information",
      "Limited search functionality",
      "Personal profile creation",
      "Up to 5 college saves"
    ],
  },
  {
    id: "pro",
    name: "Plus",
    description:
      "Enhanced features for serious college applicants",
    price: "$9.99",
    priceIntervalName: "per month",
    stripe_price_id: "price_1NkdZCHMjzZ8mGZnRSjUm4yA",
    stripe_product_id: "prod_RpxAMTArQqEY4v",
    features: [
      "Everything in Free",
      "Advanced college search filters",
      "Unlimited college saves",
      "Application deadline reminders",
      "Essay topic suggestions",
      "Counselor AI Agent (30 essay writes/edits per month)"
    ],
  },
  {
    id: "enterprise",
    name: "Pro",
    description:
      "Complete college application support for dedicated students",
    price: "$15",
    priceIntervalName: "per month",
    stripe_price_id: "price_1Nkda2HMjzZ8mGZn4sKvbDAV",
    stripe_product_id: "prod_OXj20YNpHYOXi7",
    features: [
      "Everything in Plus",
      "Priority support",
      "Essay review assistance",
      "Personalized college recommendations",
      "Application strategy consultation",
      "Counselor AI Agent (100 essay writes/edits per month)"
    ],
  },
]
