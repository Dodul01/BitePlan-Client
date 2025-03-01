import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import MealCard from "./MealCard";
import SectionHeading from "./SectionHeading";

export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  servings: number;
  tags: string[];
  dietaryInfo: string[];
  price: string;
}

const featuredMeals = [
  {
    id: "1",
    title: "Mediterranean Quinoa Bowl",
    description:
      "Fresh vegetables, feta cheese, and herb-marinated chicken over a bed of fluffy quinoa.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2340&fm=jpg&crop=entropy&cs=tinysrgb",
    price: "14.99",
    prepTime: "30 min",
    servings: 2,
    tags: ["New", "Popular"],
    dietaryInfo: ["High Protein", "Low Carb"],
  },
  {
    id: "2",
    title: "Sesame Teriyaki Salmon",
    description:
      "Perfectly glazed salmon filet with a side of steamed broccoli and jasmine rice.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2487&fm=jpg&crop=entropy&cs=tinysrgb",
    price: "16.99",
    prepTime: "25 min",
    servings: 1,
    tags: ["Seafood"],
    dietaryInfo: ["Omega-3", "Gluten-Free"],
    featured: true,
  },
  {
    id: "3",
    title: "Hearty Vegetable Curry",
    description:
      "A rich, flavorful curry packed with seasonal vegetables and aromatic spices.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2370&fm=jpg&crop=entropy&cs=tinysrgb",
    price: "12.49",
    prepTime: "40 min",
    servings: 4,
    tags: ["Vegetarian"],
    dietaryInfo: ["Plant-Based", "Vegan"],
  },
];

const FeaturedMealsSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="This Week's Featured Meals"
          subtitle="Explore our chef's selection of seasonal favorites and customer-loved dishes."
        />

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Meals</TabsTrigger>
              <TabsTrigger value="vegan">Vegan</TabsTrigger>
              <TabsTrigger value="lowCarb">Low Carb</TabsTrigger>
              <TabsTrigger value="highProtein">High Protein</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vegan">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMeals
                .filter((meal) =>
                  meal.dietaryInfo.some((diet) =>
                    ["Plant-Based", "Vegan"].includes(diet)
                  )
                )
                .map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="lowCarb">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMeals
                .filter((meal) => meal.dietaryInfo.includes("Low Carb"))
                .map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="highProtein">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMeals
                .filter((meal) => meal.dietaryInfo.includes("High Protein"))
                .map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button variant="outline" className="rounded-full px-8" asChild>
            <Link href="/meals">View All Meals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMealsSection;
